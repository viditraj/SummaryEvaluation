import audioData from './audioDataURL.json'; // Path to the converted JSON file

export default function AudioPlayer({currentTrack, playPreviousTrack, playNextTrack}) {
  return (
    <div>
      <h1>You are Listening to {currentTrack.Title}</h1>
      {audioData.length > 0 && (
        <div>
          <audio controls src={currentTrack.URL} type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
          <p>{currentTrack.English_Description}</p>
          <button onClick={playPreviousTrack}>Previous</button>
          <button onClick={playNextTrack}>Next</button>
        </div>
      )}
    </div>
  );
};
