import type { WeatherCondition } from "../lib/weather"
import type { Language } from "./translations"

export interface LiveInfoCopy {
    conditions: {
        title: string
        place: string
        feelsLike: string
        humidity: string
        wind: string
        updated: string
        unavailable: string
        source: string
        timeNote: string
        weather: Record<WeatherCondition, string>
    }
}

const en: LiveInfoCopy = {
    conditions: {
        title: "Pagbilao right now",
        place: "Pagbilao, Quezon",
        feelsLike: "Feels like",
        humidity: "Humidity",
        wind: "Wind",
        updated: "Updated",
        unavailable: "Weather is unavailable right now.",
        source: "Weather data by Open-Meteo",
        timeNote: "Philippine time",
        weather: {
            clear: "Clear",
            mostlyClear: "Mostly clear",
            partlyCloudy: "Partly cloudy",
            overcast: "Overcast",
            fog: "Fog",
            drizzle: "Drizzle",
            lightRain: "Light rain",
            rain: "Rain",
            heavyRain: "Heavy rain",
            showers: "Rain showers",
            thunderstorm: "Thunderstorm",
            other: "Mixed conditions",
        },
    },
}

const tl: LiveInfoCopy = {
    conditions: {
        title: "Pagbilao ngayon",
        place: "Pagbilao, Quezon",
        feelsLike: "Pakiramdam",
        humidity: "Halumigmig",
        wind: "Hangin",
        updated: "Na-update",
        unavailable: "Hindi available ang lagay ng panahon ngayon.",
        source: "Datos ng panahon mula sa Open-Meteo",
        timeNote: "Oras sa Pilipinas",
        weather: {
            clear: "Maaliwalas",
            mostlyClear: "Halos maaliwalas",
            partlyCloudy: "Bahagyang maulap",
            overcast: "Makulimlim",
            fog: "Hamog",
            drizzle: "Ambon",
            lightRain: "Mahinang ulan",
            rain: "Ulan",
            heavyRain: "Malakas na ulan",
            showers: "Pag-ulan",
            thunderstorm: "Pagkulog at pagkidlat",
            other: "Halo-halong lagay",
        },
    },
}

export const liveInfoCopy: Record<Language, LiveInfoCopy> = { en, tl }
