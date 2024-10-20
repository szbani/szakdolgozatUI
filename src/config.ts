interface AppConfig {
    websocket: string;
}

let config: AppConfig | null = null;

export const loadConfig = async () => {
    if (!config){
        const response = await fetch('/config.json');
        if (!response.ok){
            throw new Error('Could not load config');
        }
        config = await response.json();
    }
    return config;
}

