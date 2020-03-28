import _ from "lodash";

export const FILTER_TYPE = { BELGIUM: "BE", GLOBAL: "GL" };

export function transformDonutData(data) {
    const categories = ["Cas", "Guérisons", "Décès"];
    const series = Object.values(data)
        .reduce((prev, val) => prev.concat(val.value), [])
        .slice(0, 3);

    return {
        series,
        categories
    }
}

export function transformBarData(data) {
    const size = data.length;

    // Get only 7-day latest
    const transformedData = data.slice(size - 7, size)
        .reduce((prev, val) => {
            return {
                ...prev,
                totalConfirmed: [
                    ...prev.totalConfirmed,
                    val.totalConfirmed
                ],
                categories: [
                    ...prev.categories,
                    val.reportDate
                ]
            }
        }, {
            totalConfirmed: [],
            categories: []
        });

    const series = [{ name: 'Cas mondiaux confirmés', data: transformedData.totalConfirmed }];
    const { categories } = transformedData;

    return {
        series,
        categories
    }
}