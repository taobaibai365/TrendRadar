<script lang="ts">
  import type { ThemeSummary } from "./api";
  import { createEventDispatcher } from "svelte";

  export let themes: ThemeSummary[] = [];
  export let newThemeAgeDays: number = 1;
  
  const dispatch = createEventDispatcher();

  // 按时间批次分组
  interface ThemeBatch {
    label: string;
    themes: ThemeSummary[];
    collapsed: boolean;
  }

  $: batches = groupThemesByBatch(themes);

  function groupThemesByBatch(themes: ThemeSummary[]): ThemeBatch[] {
    if (!themes || themes.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const groups: { [key: string]: ThemeSummary[] } = {
      '刚刚': [],
      '今天': [],
      '昨天': [],
      '更早': []
    };

    for (const theme of themes) {
      const createdAt = new Date(theme.created_at);
      const themeDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 1) {
        groups['刚刚'].push(theme);
      } else if (themeDate.getTime() >= today.getTime()) {
        groups['今天'].push(theme);
      } else if (themeDate.getTime() >= yesterday.getTime()) {
        groups['昨天'].push(theme);
      } else {
        groups['更早'].push(theme);
      }
    }

    return Object.entries(groups)
      .filter(([_, items]) => items.length > 0)
      .map(([label, items]) => ({
        label,
        themes: items.sort((a, b) => b.importance - a.importance),
        collapsed: false
      }));
  }

  function toggleBatch(index: number) {
    batches[index].collapsed = !batches[index].collapsed;
    batches = batches; // 触发更新
  }

  function handleThemeClick(themeId: number) {
    dispatch('theme-click', { themeId });
  }

  function handleMarkRead(e: Event, themeId: number) {
    e.stopPropagation();
    dispatch('theme-mark-read', { themeId });
  }

  function handleArchive(e: Event, themeId: number) {
    e.stopPropagation();
    dispatch('theme-archive', { themeId });
  }

  function handleDelete(e: Event, themeId: number) {
    e.stopPropagation();
    if (confirm('确定要删除这条信息吗？')) {
      dispatch('theme-delete', { themeId });
    }
  }

  function isNew(theme: ThemeSummary): boolean {
    const createdAt = new Date(theme.created_at);
    const ageMs = Date.now() - createdAt.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    return ageDays <= newThemeAgeDays;
  }

  function getImportanceClass(importance: number): string {
    if (importance >= 8) return 'high';
    if (importance >= 5) return 'medium';
    return 'low';
  }

  function parseTags(tagsStr: string | undefined): string[] {
    if (!tagsStr) return [];
    try {
      return JSON.parse(tagsStr);
    } catch {
      return tagsStr.split(',').map(t => t.trim()).filter(t => t);
    }
  }
  
  function parseKeywords(keywordsStr: string | undefined): string[] {
    if (!keywordsStr) return [];
    try {
      return JSON.parse(keywordsStr);
    } catch {
      return keywordsStr.split(',').map(t => t.trim()).filter(t => t);
    }
  }
</script>

<div class="trendradar-theme-list-container">
  {#if themes.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📭</div>
      <p>暂无主题数据</p>
      <p class="hint">点击刷新按钮获取最新信息</p>
    </div>
  {:else}
    {#each batches as batch, batchIndex}
      <div class="batch-group">
        <div class="batch-header" on:click={() => toggleBatch(batchIndex)} role="button" tabindex="0">
          <span class="batch-toggle">{batch.collapsed ? '▶' : '▼'}</span>
          <span class="batch-label">{batch.label}</span>
          <span class="batch-count">{batch.themes.length}</span>
        </div>
        
        {#if !batch.collapsed}
          <div class="theme-list">
            {#each batch.themes as theme (theme.id)}
              <div 
                class="theme-card {theme.status === 'read' ? 'read' : ''} {theme.status === 'archived' ? 'archived' : ''}"
                on:click={() => handleThemeClick(theme.id)} 
                role="button" 
                tabindex="0"
              >
                <!-- 卡片头部：标题与状态 -->
                <div class="card-header">
                  <div class="title-row">
                    {#if isNew(theme) && theme.status !== 'read'}
                      <span class="new-dot" title="新内容"></span>
                    {/if}
                    <h2 class="title">{theme.title}</h2>
                  </div>
                  <div class="importance-badge {getImportanceClass(theme.importance)}">
                    {theme.importance}
                  </div>
                </div>
                
                <!-- 摘要 (紧凑模式) -->
                <p class="summary">{theme.summary}</p>
                
                <!-- 关键词与标签 -->
                <div class="meta-row">
                  {#if theme.keywords}
                    <div class="keywords">
                      {#each parseKeywords(theme.keywords).slice(0, 3) as kw}
                        <span class="keyword">#{kw}</span>
                      {/each}
                    </div>
                  {/if}
                  <span class="category-tag">{theme.category}</span>
                </div>
                
                <!-- 卡片底部：时间与操作 -->
                <div class="card-footer">
                  <span class="time">{new Date(theme.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                  
                  <div class="card-actions">
                    {#if theme.status !== 'read' && theme.status !== 'archived'}
                      <button class="action-btn" on:click={(e) => handleMarkRead(e, theme.id)} title="标记已读">✓</button>
                    {/if}
                    <button class="action-btn delete" on:click={(e) => handleDelete(e, theme.id)} title="删除">×</button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>

<style>
  .trendradar-theme-list-container {
    padding: 8px;
    height: 100%;
    overflow-y: auto;
  }

  .empty-state {
    text-align: center;
    margin-top: 60px;
    color: var(--text-muted);
  }

  .empty-icon {
    font-size: 32px;
    margin-bottom: 10px;
  }

  /* 批次分组 */
  .batch-group {
    margin-bottom: 12px;
  }

  .batch-header {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    font-size: 12px;
    color: var(--text-muted);
    cursor: pointer;
    user-select: none;
    margin-bottom: 4px;
    border-radius: 4px;
  }

  .batch-header:hover {
    background-color: var(--background-modifier-hover);
  }

  .batch-toggle {
    margin-right: 6px;
    font-size: 10px;
  }

  .batch-label {
    font-weight: 600;
    flex: 1;
  }

  .batch-count {
    background-color: var(--background-modifier-border);
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 10px;
  }

  /* 主题列表 */
  .theme-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* 紧凑主题卡片 */
  .theme-card {
    background-color: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 10px;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
  }

  .theme-card:hover {
    border-color: var(--interactive-accent);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .theme-card.read {
    opacity: 0.6;
    background-color: var(--background-secondary);
  }

  /* 头部 */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
  }

  .title-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    flex: 1;
    min-width: 0;
  }

  .new-dot {
    width: 6px;
    height: 6px;
    background-color: var(--color-red);
    border-radius: 50%;
    flex-shrink: 0;
    transform: translateY(-2px);
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    line-height: 1.3;
    color: var(--text-normal);
  }

  .importance-badge {
    font-size: 10px;
    font-weight: bold;
    padding: 1px 5px;
    border-radius: 4px;
    margin-left: 8px;
    flex-shrink: 0;
    background-color: var(--background-modifier-border);
    color: var(--text-muted);
  }

  .importance-badge.high {
    color: var(--color-red);
    background-color: rgba(var(--color-red-rgb), 0.1);
  }

  /* 摘要 */
  .summary {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0 0 8px 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 元数据行 */
  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 11px;
  }

  .keywords {
    display: flex;
    gap: 6px;
    overflow: hidden;
  }

  .keyword {
    color: var(--interactive-accent);
  }

  .category-tag {
    background-color: var(--background-modifier-border);
    color: var(--text-muted);
    padding: 1px 5px;
    border-radius: 3px;
    white-space: nowrap;
  }

  /* 底部 */
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 6px;
    border-top: 1px dashed var(--background-modifier-border);
  }

  .time {
    font-size: 10px;
    color: var(--text-faint);
  }

  .card-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .theme-card:hover .card-actions {
    opacity: 1;
  }

  .action-btn {
    background: none;
    border: none;
    padding: 2px 6px;
    font-size: 12px;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 3px;
  }

  .action-btn:hover {
    background-color: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .action-btn.delete:hover {
    color: var(--color-red);
    background-color: rgba(var(--color-red-rgb), 0.1);
  }
</style>
