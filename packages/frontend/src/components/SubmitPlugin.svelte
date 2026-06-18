<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let url = '';
    let message = '';
    let isError = false;

    async function handleSubmit() {
        try {
            const token = localStorage.getItem('evillite_token');
            const API_URL = import.meta.env.DEV ? 'http://localhost:8787' : import.meta.env.PUBLIC_API_URL;
            const res = await fetch(`${API_URL}/api/plugins/submit`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ githubUrl: url })
            });

            const data = await res.json();
            
            if (res.ok) {
                message = 'Plugin submitted successfully! Added to queue.';
                isError = false;
                url = ''; // reset form
                dispatch('submitted');
            } else {
                message = data.error || 'Failed to submit plugin.';
                isError = true;
            }
        } catch (err) {
            message = 'A network error occurred.';
            isError = true;
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <div class="input-group">
        <label for="githubUrl">GitHub Repository URL</label>
        <input 
            type="url" 
            id="githubUrl" 
            bind:value={url}
            placeholder="https://github.com/username/repo" 
            required 
            pattern="^https:\/\/github\.com\/[\w-]+\/[\w-]+$" 
            title="Must be a valid GitHub repository URL" 
        />
    </div>
    <button type="submit" class="submit-btn">Submit</button>
    
    {#if message}
        <div class="message" class:success={!isError} class:error={isError}>
            {message}
        </div>
    {/if}
</form>

<style>
	.input-group {
		margin-bottom: 1.5rem;
		text-align: left;
	}

	.input-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
		color: #f1eee7;
	}

	.input-group input {
		width: 100%;
		padding: 0.75rem;
		background: #151515;
		border: 2px solid #2b2b2b;
		color: #f1eee7;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.submit-btn {
		background: #d8372b;
		color: white;
		border: 2px solid #5a120e;
		padding: 0.75rem 2rem;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		width: 100%;
		transition: background 0.2s;
	}

	.submit-btn:hover {
		background: #b82c21;
	}

	.message {
		margin-top: 1rem;
		padding: 0.75rem;
		border-radius: 4px;
	}

	.message.success { background: #1a421a; border: 1px solid #2b5a2b; color: #a4d8a4; }
	.message.error { background: #421a1a; border: 1px solid #5a2b2b; color: #d8a4a4; }
</style>
