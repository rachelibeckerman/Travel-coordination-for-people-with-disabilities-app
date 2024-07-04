// import React, { useState } from 'react';

// const LocationForm = () => {
//   const [locationData, setLocationData] = useState({ lat: '', lng: '' });
//   const [locationName, setLocationName] = useState('');

//   const handlePlaceSelect = (place) => {
//     setLocationName(place.formatted_address);

//     const lat = place.geometry.location.lat();
//     const lng = place.geometry.location.lng();

//     setLocationData({ lat, lng });
//   };

//   const loadGoogleMapScript = () => {
//     const googleMapScript = document.createElement('script');
//     googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc&libraries=places`;
//     //window.document.body.appendChild(googleMapScript);

//     googleMapScript.addEventListener('load', () => {
//       const google = window.google;
//       const autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete-input'));

//       autocomplete.addListener('place_changed', () => {
//         const place = autocomplete.getPlace();
//         handlePlaceSelect(place);
//       });
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Location data - Lat:', locationData.lat, 'Lng:', locationData.lng);
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           id="autocomplete-input"
//           type="text"
//           value={locationName}
//           placeholder="Enter a location"
//           onFocus={loadGoogleMapScript} // Load Google Maps script when input is focused
//         />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default LocationForm;


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
            // setSelectedPlace({
            //     lat: place.geometry.location.lat(),
            //     lng: place.geometry.location.lng()
            // });
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    return (
        <LoadScript libraries={["places"]} googleMapsApiKey='AIzaSyAX67Cc08cXAvSkSC4nGEs3BfEVMiK8Muc'>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <InputText
                    type="text"
                    // value={value}
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