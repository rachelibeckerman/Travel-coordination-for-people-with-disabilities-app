import React, { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { InputText } from 'primereact/inputtext';

const AutocompleteLocation = ({placeholder,value,name,onChange,getGeoCode}) => {
    const [autocomplete, setAutocomplete] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const onLoad = (autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            getGeoCode(place,name)
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    return (
        <LoadScript libraries={["places"]} googleMapsApiKey='AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc'>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <InputText
                    type="text"
                    placeholder={placeholder}
                    name={name}
                    onChange={onChange}
                    style={{ width: '300px' }}
                />
            </Autocomplete>
        </LoadScript>
    );
};

export default AutocompleteLocation;