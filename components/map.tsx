"use client";
import React, { useEffect, useState } from "react";

import { APIProvider, Map, useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const App = ({ height, start, end }: { height: string; start: string; end: string }) => (
	<APIProvider apiKey={API_KEY!}>
		<Map
			style={{ width: "100%", height: height }}
			defaultZoom={9}
			gestureHandling={"greedy"}
			fullscreenControl={false}>
			<Directions start={start} end={end} />
		</Map>
	</APIProvider>
);

function Directions({ start, end }: { start: string; end: string }) {
	const map = useMap();
	const routesLibrary = useMapsLibrary("routes");
	const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
	const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
	const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
	const [routeIndex, setRouteIndex] = useState(0);
	const selected = routes[routeIndex];
	const leg = selected?.legs[0];

	useEffect(() => {
		if (!routesLibrary || !map) return;
		setDirectionsService(new routesLibrary.DirectionsService());
		setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
	}, [routesLibrary, map]);

	useEffect(() => {
		if (!directionsService || !directionsRenderer) return;

		directionsService
			.route({
				origin: start,
				destination: end,
				travelMode: google.maps.TravelMode.DRIVING,
				provideRouteAlternatives: true,
			})
			.then((response) => {
				directionsRenderer.setDirections(response);
				setRoutes(response.routes);
			});

		return () => directionsRenderer.setMap(null);
	}, [directionsService, directionsRenderer]);

	useEffect(() => {
		if (!directionsRenderer) return;
		directionsRenderer.setRouteIndex(routeIndex);
	}, [routeIndex, directionsRenderer]);

	if (!leg) return null;

	return (
		<div className='directions'>
			<h2>{selected.summary}</h2>
			<p>
				{leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
			</p>
			<p>Distance: {leg.distance?.text}</p>
			<p>Duration: {leg.duration?.text}</p>

			<h2>Other Routes</h2>
			<ul>
				{routes.map((route, index) => (
					<li key={route.summary}>
						<button onClick={() => setRouteIndex(index)}>{route.summary}</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
