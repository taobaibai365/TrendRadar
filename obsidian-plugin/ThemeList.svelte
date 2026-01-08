<script lang="ts">
  import type { ThemeSummary } from "./api";
  import { createEventDispatcher } from "svelte";

  export let themes: ThemeSummary[] = [];
  
  const dispatch = createEventDispatcher();

  function handleThemeClick(themeId: number) {
    dispatch('theme-click', { themeId });
  }
</script>

<div class="trendradar-theme-list-container">
  <div class="header">
    <h1>TrendRadar Themes</h1>
    <p>AI-curated topics and trends from your feeds.</p>
  </div>

  {#if themes.length === 0}
    <div class="empty-state">
      <p>No themes found.</p>
      <p>Click the TrendRadar ribbon icon to fetch the latest themes.</p>
    </div>
  {:else}
    <div class="theme-list">
      {#each themes as theme (theme.id)}
        <div class="theme-card" on:click={() => handleThemeClick(theme.id)} role="button" tabindex="0">
          <div class="card-header">
            <span class="category">{theme.category}</span>
            <span class="importance">Importance: {theme.importance}/10</span>
          </div>
          <h2 class="title">{theme.title}</h2>
          <p class="summary">{theme.summary}</p>
          <div class="card-footer">
            <span>Impact: {theme.impact}/10</span>
            <span>{new Date(theme.created_at).toLocaleString()}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .trendradar-theme-list-container {
    padding: var(--size-4-4);
    height: 100%;
    overflow-y: auto;
  }

  .header {
    margin-bottom: var(--size-4-8);
    padding-bottom: var(--size-4-4);
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .header h1 {
    margin-bottom: var(--size-4-1);
  }
  .header p {
    color: var(--text-muted);
  }

  .empty-state {
    text-align: center;
    margin-top: 50px;
    color: var(--text-faint);
  }

  .theme-list {
    display: grid;
    gap: var(--size-4-4);
  }

  .theme-card {
    background-color: var(--background-secondary);
    border-radius: var(--radius-m);
    padding: var(--size-4-4);
    border: 1px solid transparent;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .theme-card:hover {
    border-color: var(--background-modifier-border-hover);
    background-color: var(--background-secondary-alt);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-ui-small);
    color: var(--text-muted);
    margin-bottom: var(--size-4-2);
  }

  .category {
    background-color: var(--background-modifier-accent);
    color: var(--text-accent);
    padding: 2px 8px;
    border-radius: var(--radius-s);
    font-weight: 500;
  }
  
  .title {
    font-size: var(--font-ui-large);
    margin-bottom: var(--size-4-2);
    font-weight: 600;
  }

  .summary {
    color: var(--text-normal);
    font-size: var(--font-ui-medium);
    margin-bottom: var(--size-4-4);
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-ui-smaller);
    color: var(--text-faint);
  }
</style>
