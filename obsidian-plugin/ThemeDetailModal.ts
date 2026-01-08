import { App, Modal, Notice } from "obsidian";
import type { ThemeDetail } from "./api";
import ThemeDetailComponent from "./ThemeDetail.svelte";
import { formatThemeToMarkdown } from "./formatter";
import type TrendRadarPlugin from "./main";

export class ThemeDetailModal extends Modal {
    private component: ThemeDetailComponent;
    private theme: ThemeDetail;
    private plugin: TrendRadarPlugin;

    constructor(app: App, theme: ThemeDetail, plugin: TrendRadarPlugin) {
        super(app);
        this.theme = theme;
        this.plugin = plugin;
        this.modalEl.addClass('trendradar-detail-modal');
    }

    onOpen() {
        this.titleEl.setText(this.theme.title);

        this.component = new ThemeDetailComponent({
            target: this.contentEl,
            props: {
                theme: this.theme,
            },
        });

        this.component.$on('export-note', this.handleExport.bind(this));
    }

    onClose() {
        if (this.component) {
            this.component.$destroy();
        }
        this.contentEl.empty();
    }

    async handleExport() {
        const exportPath = this.plugin.settings.exportPath;
        if (!exportPath) {
            new Notice("Export path is not configured in TrendRadar settings.");
            return;
        }

        const { filename, content } = formatThemeToMarkdown(this.theme);
        const fullPath = `${exportPath}/${filename}`;

        try {
            // Check if the folder exists, create it if it doesn't
            if (!await this.app.vault.adapter.exists(exportPath)) {
                await this.app.vault.createFolder(exportPath);
            }
            
            // Create the new note
            const newFile = await this.app.vault.create(fullPath, content);
            new Notice(`Successfully exported note: ${newFile.basename}`);
            
            // Close the modal after exporting
            this.close();

            // Optional: Open the new note
            this.app.workspace.openLinkText(newFile.path, '', false);

        } catch (error) {
            console.error("TrendRadar - Failed to export note:", error);
            new Notice("Error exporting note. Check console for details.");
        }
    }
}
