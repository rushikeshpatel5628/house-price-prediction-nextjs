'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { toast } from '../../hooks/use-toast'

export default function PredictionPage() {
  const router = useRouter()
  const { control, register, handleSubmit, formState: { errors } } = useForm()
  const [prediction, setPrediction] = useState(null)
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/api/prediction/locations')
        setLocations(response.data.locations)
      } catch (error) {
        console.error('Error fetching locations:', error)
        toast({
          title: "Failed to load locations",
          description: "Please try refreshing the page",
          variant: "destructive",
        })
      }
    }

    fetchLocations()
  }, [])

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/prediction', {
        ...data,
        total_sqft: parseFloat(data.total_sqft),
        bhk: parseInt(data.bhk),
        bath: parseInt(data.bath)
      })
      setPrediction(response.data.prediction)
      toast({
        title: "Prediction successful",
        description: `The predicted price is ₹${response.data.prediction.toFixed(2)} lakhs`,
      })
    } catch (error) {
      console.error('Prediction error:', error)
      toast({
        title: "Prediction failed",
        description: error.response?.data?.details || "An error occurred",
        variant: "destructive",
      })
    }
  }

  const logOut = async () => {
    try { 
      await axios.get('/api/users/logout')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Home Price Prediction</CardTitle>
          <CardDescription>Enter the details to predict the home price</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Controller
                name="location"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_sqft">Total Square Feet</Label>
              <Input id="total_sqft" type="number" {...register('total_sqft', { required: true, min: 1 })} placeholder="e.g., 1000" />
              {errors.total_sqft && <span className="text-red-500">This field is required and must be positive</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bhk">BHK</Label>
              <Controller
                name="bhk"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <SelectItem key={value} value={value.toString()}>{value} BHK</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bhk && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bath">Bathrooms</Label>
              <Input id="bath" type="number" {...register('bath', { required: true, min: 1 })} placeholder="e.g., 2" />
              {errors.bath && <span className="text-red-500">This field is required and must be positive</span>}
            </div>
            <Button type="submit" className="w-full">Predict Price</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={logOut}>Logout</Button>
          {prediction && (
            <div className="text-right">
              <p className="text-sm font-semibold">Predicted Price:</p>
              <p className="text-lg font-bold">₹{prediction.toFixed(2)} lakhs</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
