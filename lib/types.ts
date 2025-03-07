export interface Task {
  id: string
  text: string
  completed: boolean
  priority: string
  createdAt: string
  dueDate?: string
  categories?: string[]
  favorite: boolean
}

export interface User {
  id: string
  name: string
  email: string
  bio?: string
  location?: string
  phone?: string
  avatar?: string
}

export interface WeatherData {
  name: string
  main: {
    temp: number
    humidity: number
    feels_like: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
}

