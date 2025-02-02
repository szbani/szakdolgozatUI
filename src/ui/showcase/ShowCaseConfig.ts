

interface ShowCaseConfig {
    mediaType: string;
    transitionStyle: string,
    transitionDuration: number,
    imageInterval: number,
    imageFit: string,
    imagePaths: string[],
}

interface PlaylistConfig {
    imagePaths: string[];
}

let config: ShowCaseConfig | null = null;
let playlistConfig: PlaylistConfig | null = null;

export const loadShowCaseConfig = async (clientId: string) => {
    const response = await fetch(`/displays/${clientId}/config.json`);
    console.log('response:', response);
    if (!response.ok) {
        throw new Error('Could not load config');
    }
    config = await response.json();

    return config;
}

export const loadPlaylistConfig = async (playlistId: string) => {
    const response = await fetch(`/playlists/${playlistId}/config.json`);
    console.log('response:', response);
    if (!response.ok) {
        throw new Error('Could not load config');
    }
    playlistConfig = await response.json();

    return playlistConfig;
}

