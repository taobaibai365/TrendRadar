<script lang="ts">
  import type { ThemeDetail } from "./api";
  import { createEventDispatcher } from "svelte";

  export let theme: ThemeDetail;
  const dispatch = createEventDispatcher();

  function handleExport() {
      dispatch('export-note');
  }
</script>

<div class="trendradar-theme-detail-container">
  <!-- Header -->
  <div class="header">
    <div class="header-top">
        <span class="category">{theme.category}</span>
        <button class="export-button" on:click={handleExport}>Export to Note</button>
    </div>
    <h1>{theme.title}</h1>
    <div class="metrics">
      <span class="metric"><b>Importance:</b> {theme.importance}/10</span>
      <span class="metric"><b>Impact:</b> {theme.impact}/10</span>
    </div>
  </div>

  <!-- Summary -->
  <div class="section summary-section">
    <h2>AI Summary</h2>
    <p>{theme.summary}</p>
  </div>

  <!-- Key Points -->
  <div class="section">
    <h2>Key Points</h2>
    <ul class="key-points">
      {#each theme.key_points as point}
        <li>{point}</li>
      {/each}
    </ul>
  </div>

  <!-- Original Articles -->
  <div class="section">
    <h2>Source Articles ({theme.articles.length})</h2>
    <div class="articles-list">
      {#each theme.articles as article}
        <div class="article-item">
          <a href={article.url} target="_blank" rel="noopener noreferrer" class="article-title">
            {article.title}
          </a>
          <div class="article-meta">
            <span>{article.author || 'Unknown Author'}</span>
            <span>{new Date(article.published_at).toLocaleString()}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

</div>

<style>
  .trendradar-theme-detail-container {
    padding: 0 4px; /* Give a little space for focus rings */
  }

  .header {
    margin-bottom: var(--size-4-6);
    padding-bottom: var(--size-4-4);
    border-bottom: 1px solid var(--background-modifier-border);
  }
  .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--size-4-2);
  }
  .export-button {
      margin-left: auto;
  }
  .header h1 {
    margin: var(--size-4-2) 0;
  }
  .category {
    background-color: var(--background-modifier-accent);
    color: var(--text-accent);
    padding: 4px 10px;
    border-radius: var(--radius-s);
    font-weight: 500;
    font-size: var(--font-ui-small);
  }
  .metrics {
    display: flex;
    gap: var(--size-4-4);
    color: var(--text-muted);
    font-size: var(--font-ui-small);
  }

  .section {
    margin-bottom: var(--size-4-6);
  }
  .section h2 {
    margin-bottom: var(--size-4-3);
    font-size: var(--font-ui-large);
    font-weight: 600;
    border-bottom: 1px solid var(--background-modifier-border);
    padding-bottom: var(--size-4-2);
  }

  .summary-section p {
    line-height: var(--line-height-normal);
  }

  .key-points {
    list-style-position: inside;
    padding-left: var(--size-4-2);
  }
  .key-points li {
    margin-bottom: var(--size-4-2);
  }

  .articles-list {
    display: flex;
    flex-direction: column;
    gap: var(--size-4-3);
    max-height: 200px;
    overflow-y: auto;
    padding-right: var(--size-4-2);
  }
  .article-item {
    padding: var(--size-4-2);
    border-radius: var(--radius-m);
    background-color: var(--background-secondary);
  }
  .article-title {
    font-weight: 500;
    text-decoration: none;
    color: var(--text-normal);
  }
  .article-title:hover {
    text-decoration: underline;
  }
  .article-meta {
    font-size: var(--font-ui-smaller);
    color: var(--text-faint);
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
  }
</style>
