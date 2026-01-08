import { App, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { getThemes } from './api';
import { TrendRadarView, TRENDRADAR_VIEW_TYPE } from './view';

// --- Settings ---

interface TrendRadarSettings {
	apiUrl: string;
	exportPath: string;
}

const DEFAULT_SETTINGS: TrendRadarSettings = {
	apiUrl: 'http://127.0.0.1:3334',
	exportPath: 'TrendRadar' // Default export folder
}

// --- Main Plugin Class ---

export default class TrendRadarPlugin extends Plugin {
	settings: TrendRadarSettings;

	async onload() {
		await this.loadSettings();
		console.log('TrendRadar AI Assistant Plugin loaded.');

		this.registerView(
			TRENDRADAR_VIEW_TYPE,
			(leaf) => new TrendRadarView(leaf, this)
		);

		// Add a ribbon icon, which will act as the main entry point for the user.
		this.addRibbonIcon('radar', 'TrendRadar AI', async (evt: MouseEvent) => {
			this.activateView();
		});
		
		// Add the settings tab.
		this.addSettingTab(new TrendRadarSettingTab(this.app, this));
	}

	onunload() {
		console.log('TrendRadar AI Assistant Plugin unloaded.');
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(TRENDRADAR_VIEW_TYPE);

		if (leaves.length > 0) {
			// A view is already open, reveal it
			leaf = leaves[0];
		} else {
			// No view is open, open a new one
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: TRENDRADAR_VIEW_TYPE, active: true });
		}
		
		// Make sure the view is revealed
		workspace.revealLeaf(leaf);

		// Fetch data and update the view
		new Notice('Fetching themes from TrendRadar API...');
		const themes = await getThemes(this.settings.apiUrl);
		
		if (themes && themes.length > 0) {
			new Notice(`Successfully fetched ${themes.length} themes.`);
			// The view should be of type TrendRadarView, we can update it
			if (leaf.view instanceof TrendRadarView) {
				leaf.view.update(themes);
			}
		} else {
			new Notice('No themes found or failed to fetch.');
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


// --- Settings Tab ---

class TrendRadarSettingTab extends PluginSettingTab {
	plugin: TrendRadarPlugin;

	constructor(app: App, plugin: TrendRadarPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'TrendRadar AI Assistant Settings'});

		new Setting(containerEl)
			.setName('Backend API URL')
			.setDesc('The URL of your TrendRadar python backend server.')
			.addText(text => text
				.setPlaceholder('Enter the API URL')
				.setValue(this.plugin.settings.apiUrl)
				.onChange(async (value) => {
					this.plugin.settings.apiUrl = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Export Folder Path')
			.setDesc('The folder inside your vault where new notes will be saved.')
			.addText(text => text
				.setPlaceholder('Example: TrendRadar/Notes')
				.setValue(this.plugin.settings.exportPath)
				.onChange(async (value) => {
					this.plugin.settings.exportPath = value;
					await this.plugin.saveSettings();
				}));
	}
}
