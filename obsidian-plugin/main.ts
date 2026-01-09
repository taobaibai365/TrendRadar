import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, TextComponent, DropdownComponent, ToggleComponent, ButtonComponent } from 'obsidian';
import { getThemes, getSources, createSource, updateSource, deleteSource, getFilterConfig, updateFilterConfig, getAIConfig, updateAIConfig, triggerFetch } from './api';
import { TrendRadarView, TRENDRADAR_VIEW_TYPE } from './view';

// --- Interfaces ---

interface TrendRadarSettings {
	apiUrl: string;
	exportPath: string;
	autoRefresh: boolean;
	refreshInterval: number; // 分钟
}

interface SourceConfig {
	id: string;
	name: string;
	type: 'rss' | 'web' | 'twitter';
	enabled: boolean;
	url: string;
	username: string;
	selector: string;
	schedule: string;
	retention_days: number;
	max_items: number;
	use_proxy: boolean;
	extra: Record<string, any>;
}

interface FilterConfig {
	keyword_blacklist: string[];
	category_blacklist: string[];
	source_blacklist: string[];
	min_content_length: number;
	min_importance: number;
	enable_ai_prefilter: boolean;
}

interface AIConfig {
	provider: string;
	api_key: string;
	base_url: string;
	model_name: string;
	temperature: number;
}

const DEFAULT_SETTINGS: TrendRadarSettings = {
	apiUrl: 'http://127.0.0.1:3334',
	exportPath: 'TrendRadar',
	autoRefresh: false,
	refreshInterval: 15
}

// --- Main Plugin Class ---

export default class TrendRadarPlugin extends Plugin {
	settings: TrendRadarSettings;
	private refreshIntervalId: number | null = null;

	async onload() {
		await this.loadSettings();
		console.log('TrendRadar AI Assistant Plugin loaded.');

		this.registerView(
			TRENDRADAR_VIEW_TYPE,
			(leaf) => new TrendRadarView(leaf, this)
		);

		// 添加工具栏图标
		this.addRibbonIcon('radar', 'TrendRadar AI', async (evt: MouseEvent) => {
			this.activateView();
		});
		
		// 添加设置选项卡
		this.addSettingTab(new TrendRadarSettingTab(this.app, this));

		// 启动自动刷新（如果启用）
		this.setupAutoRefresh();
	}

	onunload() {
		console.log('TrendRadar AI Assistant Plugin unloaded.');
		this.clearAutoRefresh();
	}

	setupAutoRefresh() {
		this.clearAutoRefresh();
		if (this.settings.autoRefresh && this.settings.refreshInterval > 0) {
			const intervalMs = this.settings.refreshInterval * 60 * 1000;
			this.refreshIntervalId = window.setInterval(() => {
				this.refreshView();
			}, intervalMs);
			console.log(`Auto-refresh enabled: every ${this.settings.refreshInterval} minutes`);
		}
	}

	clearAutoRefresh() {
		if (this.refreshIntervalId !== null) {
			window.clearInterval(this.refreshIntervalId);
			this.refreshIntervalId = null;
		}
	}

	async refreshView() {
		const leaves = this.app.workspace.getLeavesOfType(TRENDRADAR_VIEW_TYPE);
		if (leaves.length > 0) {
			const leaf = leaves[0];
			if (leaf.view instanceof TrendRadarView) {
				const response = await getThemes(this.settings.apiUrl);
				if (response && response.themes) {
					leaf.view.update(response.themes, response.new_theme_age_days);
				}
			}
		}
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(TRENDRADAR_VIEW_TYPE);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			const newLeaf = workspace.getRightLeaf(false);
			if (newLeaf) {
				await newLeaf.setViewState({ type: TRENDRADAR_VIEW_TYPE, active: true });
				leaf = newLeaf;
			}
		}
		
		if (!leaf) return;
		workspace.revealLeaf(leaf);

		new Notice('正在从 TrendRadar 获取数据...');
		const response = await getThemes(this.settings.apiUrl);
		
		if (response && response.themes && response.themes.length > 0) {
			new Notice(`成功获取 ${response.themes.length} 个主题`);
			if (leaf.view instanceof TrendRadarView) {
				leaf.view.update(response.themes, response.new_theme_age_days);
			}
		} else {
			new Notice('暂无主题数据');
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.setupAutoRefresh();
	}
}


// --- Settings Tab ---

class TrendRadarSettingTab extends PluginSettingTab {
	plugin: TrendRadarPlugin;
	private activeTab: string = 'general';
	private contentContainer: HTMLElement;

	constructor(app: App, plugin: TrendRadarPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h1', { text: 'TrendRadar 设置' });

		// Tab 导航
		const tabsContainer = containerEl.createDiv({ cls: 'trendradar-settings-tabs' });
		
		const tabs = [
			{ id: 'general', name: '常规设置', icon: 'settings' },
			{ id: 'sources', name: '数据源管理', icon: 'database' },
			{ id: 'ai', name: 'AI 配置', icon: 'bot' },
			{ id: 'filter', name: '内容过滤', icon: 'filter' }
		];

		tabs.forEach(tab => {
			const tabEl = tabsContainer.createDiv({ 
				cls: `trendradar-settings-tab ${this.activeTab === tab.id ? 'active' : ''}`,
				text: tab.name
			});
			tabEl.onclick = () => {
				this.activeTab = tab.id;
				this.display(); // 重新渲染
			};
		});

		this.contentContainer = containerEl.createDiv({ cls: 'trendradar-settings-content' });
		
		// 根据当前 Tab 渲染内容
		switch (this.activeTab) {
			case 'general':
				this.renderGeneralSettings();
				break;
			case 'sources':
				this.renderSourcesSettings();
				break;
			case 'ai':
				this.renderAISettings();
				break;
			case 'filter':
				this.renderFilterSettings();
				break;
		}
	}

	renderGeneralSettings() {
		const container = this.contentContainer;
		
		new Setting(container)
			.setName('后端 API 地址')
			.setDesc('TrendRadar Python 后端服务器的地址')
			.addText(text => text
				.setPlaceholder('http://127.0.0.1:3334')
				.setValue(this.plugin.settings.apiUrl)
				.onChange(async (value) => {
					this.plugin.settings.apiUrl = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(container)
			.setName('导出文件夹')
			.setDesc('新笔记将保存到此文件夹')
			.addText(text => text
				.setPlaceholder('TrendRadar/Notes')
				.setValue(this.plugin.settings.exportPath)
				.onChange(async (value) => {
					this.plugin.settings.exportPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(container)
			.setName('自动刷新')
			.setDesc('启用后将自动定时刷新数据')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoRefresh)
				.onChange(async (value) => {
					this.plugin.settings.autoRefresh = value;
					await this.plugin.saveSettings();
				}));

		new Setting(container)
			.setName('刷新间隔（分钟）')
			.setDesc('自动刷新的时间间隔')
			.addText(text => text
				.setPlaceholder('15')
				.setValue(String(this.plugin.settings.refreshInterval))
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num) && num > 0) {
						this.plugin.settings.refreshInterval = num;
						await this.plugin.saveSettings();
					}
				}));

		// 任务控制
		container.createEl('h3', { text: '任务控制' });
		
		new Setting(container)
			.setName('立即抓取')
			.setDesc('手动触发一次完整的数据抓取和分析任务（后台运行）')
			.addButton(button => button
				.setButtonText('🚀 开始抓取')
				.setCta()
				.onClick(async () => {
					new Notice('正在触发抓取任务...');
					try {
						const success = await triggerFetch(this.plugin.settings.apiUrl);
						if (success) {
							new Notice('抓取任务已在后台启动，请稍后刷新查看结果');
						} else {
							new Notice('触发失败，请检查后端连接');
						}
					} catch (error) {
						new Notice('触发失败: ' + error);
					}
				}));
	}

	renderSourcesSettings() {
		const container = this.contentContainer;
		
		container.createEl('p', { 
			text: '在这里添加、编辑或删除您的信息订阅源。支持 RSS、网站爬取和 Twitter/X 账号。',
			cls: 'setting-item-description'
		});

		new Setting(container)
			.setName('添加新数据源')
			.addButton(button => button
				.setButtonText('+ 添加数据源')
				.setCta()
				.onClick(() => {
					new SourceEditModal(this.app, this.plugin, null, () => {
						this.renderSourcesSettings(); // 刷新列表
					}).open();
				}));

		const listContainer = container.createDiv({ cls: 'trendradar-sources-list' });
		this.refreshSourcesList(listContainer);
	}

	async refreshSourcesList(container: HTMLElement) {
		container.empty();
		try {
			const sources = await getSources(this.plugin.settings.apiUrl);
			
			if (sources.length === 0) {
				container.createEl('div', { text: '暂无数据源，请点击上方按钮添加。', cls: 'trendradar-empty-state' });
				return;
			}

			sources.forEach(source => {
				const item = container.createDiv({ cls: 'trendradar-source-item' });
				
				// 图标
				const iconDiv = item.createDiv({ cls: 'source-icon' });
				let iconName = 'rss';
				if (source.type === 'web') iconName = 'globe';
				if (source.type === 'twitter') iconName = 'twitter';
				// 简单模拟图标
				iconDiv.setText(source.type.toUpperCase());

				// 信息
				const infoDiv = item.createDiv({ cls: 'source-info' });
				infoDiv.createDiv({ cls: 'source-name', text: source.name });
				infoDiv.createDiv({ cls: 'source-url', text: source.url || source.username || 'No URL' });

				// 操作
				const actionsDiv = item.createDiv({ cls: 'source-actions' });
				
				// 启用/禁用开关
				const toggle = new ToggleComponent(actionsDiv)
					.setValue(source.enabled)
					.onChange(async (value) => {
						source.enabled = value;
						await updateSource(this.plugin.settings.apiUrl, source.id, source);
					});
				toggle.setTooltip(source.enabled ? '已启用' : '已禁用');

				// 编辑按钮
				new ButtonComponent(actionsDiv)
					.setIcon('pencil')
					.setTooltip('编辑')
					.onClick(() => {
						new SourceEditModal(this.app, this.plugin, source, () => {
							this.refreshSourcesList(container);
						}).open();
					});

				// 删除按钮
				new ButtonComponent(actionsDiv)
					.setIcon('trash')
					.setTooltip('删除')
					.setClass('mod-warning')
					.onClick(async () => {
						if (confirm(`确定要删除数据源 "${source.name}" 吗？`)) {
							await deleteSource(this.plugin.settings.apiUrl, source.id);
							this.refreshSourcesList(container);
						}
					});
			});

		} catch (error) {
			container.createEl('div', { text: '无法加载数据源列表，请检查后端连接。', cls: 'trendradar-error-state' });
		}
	}

	async renderAISettings() {
		const container = this.contentContainer;
		container.empty();

		try {
			const config = await getAIConfig(this.plugin.settings.apiUrl);
			
			new Setting(container)
				.setName('AI 提供商')
				.setDesc('选择 AI 服务提供商')
				.addDropdown(dropdown => dropdown
					.addOption('openai', 'OpenAI')
					.addOption('deepseek', 'DeepSeek')
					.addOption('gemini', 'Google Gemini')
					.setValue(config.provider)
					.onChange(async (value) => {
						config.provider = value;
						await updateAIConfig(this.plugin.settings.apiUrl, config);
					}));

			new Setting(container)
				.setName('API Key')
				.setDesc('输入您的 API Key')
				.addText(text => text
					.setPlaceholder('sk-...')
					.setValue(config.api_key)
					.onChange(async (value) => {
						config.api_key = value;
						await updateAIConfig(this.plugin.settings.apiUrl, config);
					}));

			new Setting(container)
				.setName('Base URL')
				.setDesc('API 基础地址（可选，用于中转或自定义端点）')
				.addText(text => text
					.setPlaceholder('https://api.openai.com/v1')
					.setValue(config.base_url)
					.onChange(async (value) => {
						config.base_url = value;
						await updateAIConfig(this.plugin.settings.apiUrl, config);
					}));

			new Setting(container)
				.setName('模型名称')
				.setDesc('指定使用的模型（如 gpt-4o, deepseek-chat）')
				.addText(text => text
					.setPlaceholder('gpt-3.5-turbo')
					.setValue(config.model_name)
					.onChange(async (value) => {
						config.model_name = value;
						await updateAIConfig(this.plugin.settings.apiUrl, config);
					}));

			new Setting(container)
				.setName('温度 (Temperature)')
				.setDesc('控制生成内容的随机性 (0.0 - 1.0)')
				.addSlider(slider => slider
					.setLimits(0, 1, 0.1)
					.setValue(config.temperature)
					.setDynamicTooltip()
					.onChange(async (value) => {
						config.temperature = value;
						await updateAIConfig(this.plugin.settings.apiUrl, config);
					}));

		} catch (error) {
			container.createEl('p', { text: '无法加载 AI 配置，请检查后端服务是否运行。', cls: 'trendradar-error-text' });
		}
	}

	async renderFilterSettings() {
		const container = this.contentContainer;
		container.empty();

		try {
			const config = await getFilterConfig(this.plugin.settings.apiUrl);

			new Setting(container)
				.setName('关键词黑名单')
				.setDesc('包含这些关键词的内容将被过滤（用逗号分隔）')
				.addTextArea(text => text
					.setPlaceholder('广告, 推广, ...')
					.setValue(config.keyword_blacklist.join(', '))
					.onChange(async (value) => {
						config.keyword_blacklist = value.split(/[,，]/).map(s => s.trim()).filter(s => s);
						await updateFilterConfig(this.plugin.settings.apiUrl, config);
					}));

			new Setting(container)
				.setName('分类黑名单')
				.setDesc('属于这些分类的内容将被过滤（用逗号分隔）')
				.addTextArea(text => text
					.setPlaceholder('娱乐, 八卦, ...')
					.setValue(config.category_blacklist.join(', '))
					.onChange(async (value) => {
						config.category_blacklist = value.split(/[,，]/).map(s => s.trim()).filter(s => s);
						await updateFilterConfig(this.plugin.settings.apiUrl, config);
					}));

			new Setting(container)
				.setName('AI 预过滤')
				.setDesc('启用后，将使用 AI 初步判断内容相关性（会消耗 Token）')
				.addToggle(toggle => toggle
					.setValue(config.enable_ai_prefilter)
					.onChange(async (value) => {
						config.enable_ai_prefilter = value;
						await updateFilterConfig(this.plugin.settings.apiUrl, config);
					}));

		} catch (error) {
			container.createEl('p', { text: '无法加载过滤配置，请检查后端服务是否运行。', cls: 'trendradar-error-text' });
		}
	}
}

// --- Source Edit Modal ---

class SourceEditModal extends Modal {
	plugin: TrendRadarPlugin;
	source: SourceConfig | null;
	onSave: () => void;

	constructor(app: App, plugin: TrendRadarPlugin, source: SourceConfig | null, onSave: () => void) {
		super(app);
		this.plugin = plugin;
		this.source = source;
		this.onSave = onSave;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: this.source ? '编辑数据源' : '添加数据源' });

		const config: SourceConfig = this.source ? { ...this.source } : {
			id: '',
			name: '',
			type: 'rss',
			enabled: true,
			url: '',
			username: '',
			selector: '',
			schedule: '0 * * * *',
			retention_days: 7,
			max_items: 20,
			use_proxy: false,
			extra: {}
		};

		// 类型选择
		new Setting(contentEl)
			.setName('类型')
			.addDropdown(dropdown => dropdown
				.addOption('rss', 'RSS 订阅')
				.addOption('web', '网站爬取')
				.addOption('twitter', 'Twitter/X 用户')
				.setValue(config.type)
				.onChange(value => {
					config.type = value as any;
					this.onOpen(); // 刷新界面以显示不同类型的字段
				}));

		new Setting(contentEl)
			.setName('名称')
			.addText(text => text
				.setValue(config.name)
				.onChange(value => config.name = value));

		if (config.type === 'rss' || config.type === 'web') {
			new Setting(contentEl)
				.setName('URL')
				.setDesc(config.type === 'rss' ? 'RSS Feed 地址' : '目标网页地址')
				.addText(text => text
					.setValue(config.url)
					.onChange(value => config.url = value));
		}

		if (config.type === 'web') {
			new Setting(contentEl)
				.setName('CSS 选择器')
				.setDesc('用于提取文章链接的 CSS 选择器 (例如: .post-title a)')
				.addText(text => text
					.setValue(config.selector || '')
					.onChange(value => config.selector = value));
		}

		if (config.type === 'twitter') {
			new Setting(contentEl)
				.setName('用户名')
				.setDesc('Twitter 用户名 (不带 @)')
				.addText(text => text
					.setValue(config.username || '')
					.onChange(value => config.username = value));
		}

		new Setting(contentEl)
			.setName('保留天数')
			.addText(text => text
				.setValue(String(config.retention_days))
				.onChange(value => config.retention_days = parseInt(value) || 7));

		new Setting(contentEl)
			.setName('最大条目数')
			.setDesc('每次抓取的最大数量')
			.addText(text => text
				.setValue(String(config.max_items))
				.onChange(value => config.max_items = parseInt(value) || 20));

		new Setting(contentEl)
			.addButton(button => button
				.setButtonText('保存')
				.setCta()
				.onClick(async () => {
					if (!config.name) {
						new Notice('请输入名称');
						return;
					}
					
					// 自动生成 ID
					if (!config.id) {
						config.id = config.type + '_' + Date.now();
					}

					try {
						if (this.source) {
							await updateSource(this.plugin.settings.apiUrl, config.id, config);
						} else {
							await createSource(this.plugin.settings.apiUrl, config);
						}
						this.onSave();
						this.close();
						new Notice('保存成功');
					} catch (error) {
						new Notice('保存失败: ' + error);
					}
				}));
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
