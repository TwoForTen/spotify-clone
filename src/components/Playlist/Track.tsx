import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ThemeProp } from 'src/interfaces/ThemeProp';
import { TypeOfPlaylist } from 'src/interfaces/TypeOfPlaylist';
import moment from 'moment';
import axiosInstance from 'src/axiosInstance';
import { useCookies } from 'react-cookie';

interface Props {
  track: any;
  index: number;
  type: TypeOfPlaylist;
}

const TrackContainer = styled.div`
  display: grid;
  grid-template-columns: 20px 4fr 3fr 30px;
  grid-gap: 20px;
  width: 100%;
  padding: 0 15px;
  height: 60px;
  align-items: center;
  /* white-space: nowrap; */
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: ${({ theme }: ThemeProp) => theme.shape.borderRadius};
  &:hover {
    background-color: rgba(50, 50, 50, 0.8);
  }
`;

const ImageContainer = styled.div`
  min-height: 40px;
  min-width: 40px;
  max-height: 40px;
  max-width: 40px;
  margin-right: 15px;
  position: relative;
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const ImageSkeleton = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(50, 50, 50, 0.5);
  position: absolute;
  top: 0;
  left: 0;
`;

const TrackInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TrackTitle = styled.h5`
  color: ${({ theme }: ThemeProp) => theme.colors.common.white};
  font-weight: 400;
  font-size: 15px;
`;

const TrackInfo = styled.span`
  color: ${({ theme }: ThemeProp) => theme.colors.ui.text};
  font-size: 13px;
  ${TrackContainer}:hover & {
    color: white !important;
  }
`;

const Track: React.FC<Props> = ({ track, index, type }): JSX.Element => {
  const imgRef = useRef<HTMLImageElement>(null);

  // const [cookie] = useCookies(['access']);

  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [trackHovered, setTrackHovered] = useState<boolean>(false);

  useEffect(() => {
    if (imgRef.current?.complete) setImgLoaded(true);
  }, []);

  return (
    <TrackContainer
      onMouseOver={() => setTrackHovered(true)}
      onMouseLeave={() => setTrackHovered(false)}
    >
      {!trackHovered ? (
        <TrackInfo style={{ fontSize: '16px', textAlign: 'right' }}>
          {index}
        </TrackInfo>
      ) : (
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="22"
            viewBox="0 0 24 24"
            width="22"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M8 5v14l11-7z" fill="white" />
          </svg>
        </span>
      )}
      <TrackInfoContainer>
        {type === 'playlist' && (
          <ImageContainer>
            <Image
              loading="lazy"
              ref={imgRef}
              src={track?.album?.images[0]?.url}
              alt=""
              onLoad={() => setImgLoaded(true)}
              style={{ visibility: imgLoaded ? 'visible' : 'hidden' }}
            />
            {(!imgLoaded || !!!track?.album?.images[0]?.url) && (
              <ImageSkeleton />
            )}
          </ImageContainer>
        )}
        <div>
          <TrackTitle>{track?.name}</TrackTitle>
          <TrackInfo>
            {track?.artists?.map((artist: any) => artist?.name).join(', ')}
          </TrackInfo>
        </div>
      </TrackInfoContainer>
      {type === 'playlist' && <TrackInfo>{track?.album?.name}</TrackInfo>}
      <TrackInfo style={{ textAlign: 'right' }}>
        {moment(track?.duration_ms).format('m:ss')}
      </TrackInfo>
    </TrackContainer>
  );
};

export default Track;