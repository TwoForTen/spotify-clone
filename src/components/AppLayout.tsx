import { useEffect } from 'react';
import Script from 'react-load-script';
import Header from 'src/components/Header';
import Sidebar from 'src/components/Sidebar';
import FooterPlayer from 'src/components/Player';
import { UserPlaylists } from 'src/pages/_app';
import { useDispatch, useSelector } from 'react-redux';

import { GlobalState } from 'src/store';
import { storeDeviceId } from 'src/store/Device/actions';
import {
  storeTrack,
  updatePosition,
  setVolume,
} from 'src/store/PlayingNow/actions';
import { PlayingNowState } from 'src/store/PlayingNow/types';

type Props = {
  username: string;
  playlists: UserPlaylists;
  accessToken: string;
};

const AppLayout: React.FC<Props> = ({
  username,
  playlists,
  accessToken,
}): JSX.Element => {
  const dispatch = useDispatch();
  const paused = useSelector<GlobalState, PlayingNowState['paused']>(
    (state: GlobalState) => state.playingNow.paused
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token: string = accessToken;
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: (cb: (token: string) => void) => {
            cb(token);
          },
        });

        // Error handling
        player.addListener('initialization_error', ({ message }: any) => {
          console.error(message);
        });
        player.addListener('authentication_error', ({ message }: any) => {
          console.error(message);
        });
        player.addListener('account_error', ({ message }: any) => {
          console.error(message);
        });
        player.addListener('playback_error', ({ message }: any) => {
          console.error(message);
        });

        // Playback status updates
        player.addListener('player_state_changed', (state: any) => {
          dispatch(
            storeTrack({
              context: {
                contextDescription: state.context.metadata.context_description,
                contextUri: state.context.uri,
              },
              artists: state.track_window.current_track.artists,
              duration: state.duration,
              position: state.position,
              id: state.track_window.current_track.id,
              imageUrl: state.track_window.current_track.album.images[0].url,
              name: state.track_window.current_track.name,
              paused: state.paused,
            })
          );
        });

        // Get Initial Volume
        player.getVolume().then((volume: number) => {
          dispatch(setVolume(volume));
        });

        // Get Current Track Position
        if (!paused) {
          setInterval(() => {
            player.getCurrentState().then((state: any) => {
              if (state) {
                dispatch(updatePosition(state.position));
              }
            });
          }, 500);
        }

        // Ready
        player.addListener('ready', ({ device_id }: any) => {
          dispatch(storeDeviceId({ deviceId: device_id }));
          console.log('Ready with Device ID', device_id);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }: any) => {
          console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect();
      };
    }
  }, [paused]);
  return (
    <>
      <Header username={username} />
      <Sidebar playlists={playlists} />
      <FooterPlayer />
      <Script url="https://sdk.scdn.co/spotify-player.js" onLoad={() => {}} />
    </>
  );
};

export default AppLayout;
