"use client";
import React, { useRef } from "react";
import { GoogleMap, DirectionsService, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const MapComponent = ({ start, end, height = "100dvh" }: { start: string; end: string; height: string }) => {
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: "AIzaSyA_JK35qXPprcxihIJXFVlhGn7xWdDrQi0",
	});

	const [response, setResponse] = React.useState(null);
	const mapRef = useRef(null);
	const mapStyles = {
		height: height,
		width: "100%",
	};

	const directionsCallback = (res: any) => {
		if (res !== null) {
			if (res.status === "OK") {
				setResponse(res);
			} else {
				console.log("response: ", res);
			}
		}
	};

	return isLoaded ? (
		<GoogleMap ref={mapRef} mapContainerStyle={mapStyles} zoom={8}>
			<DirectionsService
				options={{
					destination: start,
					origin: end,
					travelMode: window.google.maps.TravelMode.DRIVING,
				}}
				callback={directionsCallback}
			/>
			{response !== null && (
				<DirectionsRenderer
					options={{
						directions: response,
					}}
				/>
			)}
		</GoogleMap>
	) : (
		<></>
	);
};

export default MapComponent;
