import { ItemView, WorkspaceLeaf, Notice } from "obsidian";
import { getThemeDetails, type ThemeSummary } from "./api";
import ThemeList from "./ThemeList.svelte"; // This will be our Svelte component
import type TrendRadarPlugin from "./main";
import { ThemeDetailModal } from "./ThemeDetailModal";

export const TRENDRADAR_VIEW_TYPE = "trendradar-view";

export class TrendRadarView extends ItemView {
    component: ThemeList;
    plugin: TrendRadarPlugin;

    constructor(leaf: WorkspaceLeaf, plugin: TrendRadarPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return TRENDRADAR_VIEW_TYPE;
    }

    getDisplayText() {
        return "TrendRadar Themes";
    }

    getIcon() {
        return "radar";
    }

    async onOpen() {
        this.component = new ThemeList({
            target: this.contentEl,
            props: {
                themes: [], // Initially empty
            },
        });

        this.component.$on("theme-click", this.onThemeClick.bind(this));
    }

    async onClose() {
        if (this.component) {
            this.component.$destroy();
        }
    }

    async onThemeClick(event: any) {
        const themeId = event.detail.themeId;
        new Notice(`Fetching details for theme ${themeId}...`);

        const themeDetails = await getThemeDetails(this.plugin.settings.apiUrl, themeId);

        if (themeDetails) {
            new ThemeDetailModal(this.app, themeDetails, this.plugin).open();
        } else {
            new Notice("Failed to fetch theme details.");
        }
    }

    // Helper function to update the view with new data
    async update(themes: ThemeSummary[]) {
        this.component.$set({ themes });
    }
}
