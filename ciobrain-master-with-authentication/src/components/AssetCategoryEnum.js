import appIcon from "../images/appIcon.png"
import dataIcon from "../images/dataIcon.png"
import infrastructureIcon from "../images/infrastructureIcon.png"
import talentIcon from "../images/talentIcon.png"
import projectsIcon from "../images/projectsIcon.png"
import businessIcon from "../images/businessIcon.png"

export const AssetCategoryEnum = {
    APPLICATION: {
        name: "Application",
        index: "1",
        color: "var(--red)",
        backgroundColor: "var(--opaque-red)",
        icon: appIcon
    },
    DATA: {
        name: "Data",
        index: "2",
        color: "var(--green)",
        backgroundColor: "var(--opaque-green)",
        icon: dataIcon
    },
    INFRASTRUCTURE: {
        name: "Infrastructure",
        index: "3",
        color: "var(--blue)",
        backgroundColor: "var(--opaque-blue)",
        icon: infrastructureIcon
    },
    TALENT: {
        name: "Talent",
        index: "4",
        color: "var(--yellow)",
        backgroundColor: "var(--opaque-yellow)",
        icon: talentIcon
    },
    PROJECTS: {
        name: "Projects",
        index: "5",
        color: "var(--purple)",
        backgroundColor: "var(--opaque-purple)",
        icon: projectsIcon
    },
    BUSINESS: {
        name: "Business",
        index: "6",
        color: "var(--gray)",
        backgroundColor: "var(--opaque-gray)",
        icon: businessIcon
    }
}
