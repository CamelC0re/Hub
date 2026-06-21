<script>
    import { toasts, removeToast } from '../stores/toast.js';
    import { fade, fly } from 'svelte/transition';
</script>

<div class="toast-container">
    {#each $toasts as toast (toast.id)}
        <div 
            class="toast {toast.type}" 
            in:fly="{{ y: 20, duration: 300 }}" 
            out:fade="{{ duration: 200 }}"
        >
            <div class="toast-content">{toast.message}</div>
            <button class="toast-close" on:click={() => removeToast(toast.id)}>×</button>
        </div>
    {/each}
</div>

<style>
    .toast-container {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        z-index: 9999;
        pointer-events: none;
    }

    .toast {
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 250px;
        max-width: 350px;
        padding: 1rem;
        background: #151515;
        border: 2px solid #2b2b2b;
        color: #f1eee7;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    }

    .toast.success {
        border-color: #2b5a2b;
        background: #1a421a;
    }

    .toast.error {
        border-color: #5a2b2b;
        background: #421a1a;
    }

    .toast-content {
        flex: 1;
        font-size: 0.95rem;
        line-height: 1.4;
    }

    .toast-close {
        background: none;
        border: none;
        color: #888;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: 1rem;
    }

    .toast-close:hover {
        color: #fff;
    }
</style>
