const repository =
    require("../repositories/analyticsRepository");


/*
 * Get enrollment trends
 */
const getEnrollmentTrends = async () => {

    return await repository.getEnrollmentTrends();
};


/*
 * Get course completion rates
 */
const getCourseCompletionRates = async () => {

    return await repository.getCourseCompletionRates();
};


module.exports = {
    getEnrollmentTrends,
    getCourseCompletionRates
};