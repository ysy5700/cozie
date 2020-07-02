export default [
    {
        name: "surrounding",
        type: "icon",
        requiresAnswer: [],
        questionText: "Do your surroundings",
        questionSecondText: "increase infection risk?",
        iconText: ["Not at all", "A lot", "A little"],
        iconColors: ["fb-cyan", "fb-orange", "fb-green"],
        iconImages: [
            "images/icons/shield.png",
            "images/icons/1_virus.png",
            "images/icons/3_virus.png",
        ],
    },
    {
        name: "risk",
        type: "icon",
        requiresAnswer: [],
        questionText: "What causes more risk?",
        questionSecondText: "",
        iconText: ["People", "Surface", "Ventilation"],
        iconColors: ["fb-cyan", "fb-orange", "fb-green"],
        iconImages: [
            "images/icons/People.png",
            "images/icons/Surface.png",
            "images/icons/Ventilation.png",
        ],
    },
    {
        name: "concern",
        type: "icon",
        requiresAnswer: [{ question: "risk", value: 11 }],
        questionText: "Specifically, what",
        questionSecondText: "concerns you?",
        iconText: ["Density", "Proximity", "Both"],
        iconColors: ["fb-cyan", "fb-orange", "fb-green"],
        iconImages: [
            "images/icons/Density.png",
            "images/icons/Proximity.png",
            "images/icons/Both.png",
        ],
    },
    {
        name: "crowded",
        type: "icon",
        requiresAnswer: [],
        questionText: "Are your surroundings",
        questionSecondText: "crowded?",
        iconText: ["No", "Yes"],
        iconColors: ["fb-orange", "fb-green"],
        iconImages: [
            "images/icons/No_onith.png",
            "images/icons/Yes_onith.png",
        ],
    },
    {
        name: "numberPeople",
        type: "icon",
        requiresAnswer: [],
        questionText: "Currently, how many",
        questionSecondText: "people within 5m?",
        iconText: ["0 pax", "1-4 pax", "5+ pax"],
        iconColors: ["#6decb9", "#42dee1", "#3fc5f0"],
        iconImages: [
            "images/icons/0pax.png",
            "images/icons/1-4pax.png",
            "images/icons/5pax.png",
        ],
    },
];