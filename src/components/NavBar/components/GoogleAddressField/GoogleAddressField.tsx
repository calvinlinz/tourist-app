import React, {useRef, useEffect, useState} from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import InputField from '../InputField/InputField';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  placeholder?: string;
  width?: string;
  options: google.maps.places.AutocompleteOptions;
}

export const GoogleAddressField = ({
  onPlaceSelect,
  inputRef,
  placeholder,
  width,
  options,
}: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <InputField inputRef={inputRef} placeholder={placeholder} width={width} />
  );
};