import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming EnarmUtil.getCategory uses route params
import Caso from "./Caso";
import EnarmUtil from "../modules/EnarmUtil";
import FacebookComments from "./facebook/FacebookComments";

const Examen = () => {
  const params = useParams(); // Get route parameters

  // Initial state calculation using params directly, similar to constructor
  // This requires EnarmUtil.getCategory to be callable with a structure mimicking props
  const initialClinicCaseId = EnarmUtil.getCategory({ match: { params: params } });
  const initialCommentUrl = `http://enarm.godieboy.com/#/caso/${initialClinicCaseId}`;

  const [clinicCaseId, setClinicCaseId] = useState(initialClinicCaseId);
  const [commentUrl, setCommentUrl] = useState(initialCommentUrl);
  const [width, setWidth] = useState(300); // Default width

  // Effect for updating clinicCaseId and commentUrl when route params change
  useEffect(() => {
    const newClinicCaseId = EnarmUtil.getCategory({ match: { params: params } });
    setClinicCaseId(newClinicCaseId);
    setCommentUrl(`http://enarm.godieboy.com/#/caso/${newClinicCaseId}`);
  }, [params]);

  // Effect for updating dimensions on mount and window resize
  useEffect(() => {
    const updateDimensionsFunc = () => {
      if (window.innerWidth < 500) {
        setWidth(300);
        // Original code set height here, but it's not used in FacebookComments props
      } else {
        let update_width = window.innerWidth - 500;
        setWidth(update_width);
        // Original code set height here
      }
    };

    updateDimensionsFunc(); // Call on mount
    window.addEventListener('resize', updateDimensionsFunc);

    return () => {
      window.removeEventListener('resize', updateDimensionsFunc); // Cleanup listener
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <div className="s12 m12 l6 white">
      <Caso
        clinicCaseId={clinicCaseId}
      />
      <div className="row">
        <div className="col s12 m10 l8">
          {/* Conditional rendering of FacebookComments can be kept if it was intentional,
              otherwise the curly braces are not strictly necessary if always rendered.
              Assuming it's always rendered if this component is rendered. */}
          <FacebookComments
            appId="401225480247747"
            href={commentUrl}
            width={width}
            numPosts={10}
            locale="es_LA"
          />
        </div>
      </div>
    </div>
  );
};

export default Examen;
