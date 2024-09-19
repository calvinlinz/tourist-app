import { Map } from "@vis.gl/react-google-maps";
import Markers from "./Markers/Markers";
import Directions from "./Directions/Directions";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export const center = {
  lat: -36.84845,
  lng: 174.762192,
};

export default function TourismMap() {
  return (
    <div style={mapContainerStyle}>
      <Map defaultCenter={center} defaultZoom={14} mapId={"ID21c337e37bcf6cba"}>
        <Markers />
        <Directions />
      </Map>
    </div>
  );
}
