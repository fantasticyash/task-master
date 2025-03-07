"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Cloud, CloudRain, Loader2, Sun, AlertCircle, CloudSnow, CloudLightning } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function WeatherWidget() {
  const { data, loading, error } = useSelector((state: RootState) => state.weather)

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading weather...
      </Button>
    )
  }

  if (error) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-500">
              <AlertCircle className="h-4 w-4 mr-2" />
              Weather unavailable
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{error}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (!data) {
    return null
  }

  const getWeatherIcon = () => {
    const weatherCode = data.weather[0].id

    // Thunderstorm
    if (weatherCode >= 200 && weatherCode < 300) {
      return <CloudLightning className="h-4 w-4 mr-2" />
    }
    // Drizzle or Rain
    else if ((weatherCode >= 300 && weatherCode < 400) || (weatherCode >= 500 && weatherCode < 600)) {
      return <CloudRain className="h-4 w-4 mr-2" />
    }
    // Snow
    else if (weatherCode >= 600 && weatherCode < 700) {
      return <CloudSnow className="h-4 w-4 mr-2" />
    }
    // Clear
    else if (weatherCode === 800) {
      return <Sun className="h-4 w-4 mr-2" />
    }
    // Clouds
    else {
      return <Cloud className="h-4 w-4 mr-2" />
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            {getWeatherIcon()}
            {Math.round(data.main.temp)}°C
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{data.name}</p>
            <p>{data.weather[0].description}</p>
            <p>Humidity: {data.main.humidity}%</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

