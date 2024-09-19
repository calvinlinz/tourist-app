import React, { Suspense, useState, useEffect } from "react";
import "./App.css";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ItineraryProvider } from "./context/ItineraryContext";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ReactLoading from "react-loading";
import GeneratePage from "./pages/GeneratePage/GeneratePage";
const HomePage = React.lazy(() => import("./pages/HomePage/HomePage"));
const MainPage = React.lazy(() => import("./pages/MainPage/MainPage"));

const Loading = (
  <ReactLoading
    type={"bubbles"}
    color={"#20CCFF"}
    height={"20%"}
    width={"20%"}
  />
);

const App = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY ?? "";

  return (
    <div className="App">
      <APIProvider
        apiKey={GOOGLE_API_KEY}
        onLoad={() => setIsGoogleLoaded(true)}
      >
        <ItineraryProvider isGoogleLoaded={isGoogleLoaded}>
          <BrowserRouter>
            <Routes>
              <Route
                index
                element={
                  <Suspense fallback={Loading}>
                    <HomePage />
                  </Suspense>
                }
              />
              <Route
                path="/itinerary"
                element={
                  <Suspense fallback={Loading}>
                    <MainPage />
                  </Suspense>
                }
              />
              <Route
                path="/generate"
                element={
                  <Suspense fallback={Loading}>
                    <GeneratePage />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
          <ToastContainer position="top-center" autoClose={1000} />
        </ItineraryProvider>
      </APIProvider>
    </div>
  );
};

export default App;
