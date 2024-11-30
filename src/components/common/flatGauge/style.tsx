
const maturityLevelColorMap: any = {
    ML2: ["#822123", "#347444"],
    ML3: ["#822123", "#BE5923", "#347444"],
    ML4: ["#822123", "#BE5923", "#F4B949", "#347444"],
    ML5: ["#862123", "#BE5823", "#F4B942", "#9BB763", "#347444"],
};

export const MaturityLevelColors = (maturity_level_number: number) => {
    switch (maturity_level_number) {
        case 2:
            return maturityLevelColorMap.ML2;
        case 3:
            return maturityLevelColorMap.ML3;
        case 4:
            return maturityLevelColorMap.ML4;
        case 5:
            return maturityLevelColorMap.ML5;
    }
};
