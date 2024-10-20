interface ShowCaseConfig {
    mediaType: string;

}

let config: ShowCaseConfig | null = null;

export const loadShowCaseConfig = async (clientId: string) => {
    const response = await fetch(`/${clientId}/config.json`);
    console.log('response:', response);
    if (!response.ok) {
        throw new Error('Could not load config');
    }
    config = await response.json();

    return config;
}

