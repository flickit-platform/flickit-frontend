import React from 'react';
import kitStore from "@assets/svg/kitStore1.svg"
import AssessmentKitsStoreBanner from "@components/assessment-kit/AssessmentKitsStoreBanner";
import AssessmentKitsStoreListCard from "@components/assessment-kit/AssessmentKitsStoreListCard";

const AssessmentKitsStore = () => {
    return (
        <>
            <AssessmentKitsStoreBanner/>
            <AssessmentKitsStoreListCard/>
        </>
    )
}

export default AssessmentKitsStore;