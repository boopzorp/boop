"use client"

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import type { Entry, EntryType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type MonthlyMeterProps = {
  entries: Entry[];
};

export function MonthlyMeter({ entries }: MonthlyMeterProps) {
  const [goal, setGoal] = useState(5);
  const [type, setType] = useState<EntryType>('book');
  
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    // This prevents the hydration mismatch between server and client.
    setCurrentDate(new Date());
  }, []);

  const progress = useMemo(() => {
    if (!currentDate) return 0;
    
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const count = entries.filter(entry => {
      const entryDate = entry.addedAt;
      return entry.type === type &&
             entryDate.getMonth() === currentMonth &&
             entryDate.getFullYear() === currentYear;
    }).length;

    if (goal <= 0) return 0;
    return (count / goal) * 100;
  }, [entries, goal, type, currentDate]);

  const currentCount = useMemo(() => {
    if (!currentDate) return 0;
    
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return entries.filter(entry => {
      const entryDate = entry.addedAt;
      return entry.type === type &&
             entryDate.getMonth() === currentMonth &&
             entryDate.getFullYear() === currentYear;
    }).length;
  }, [entries, type, currentDate]);

  const monthName = currentDate?.toLocaleString('default', { month: 'long' });

  return (
    <Card className="m-2">
      <CardHeader>
        <CardTitle>Monthly Meter</CardTitle>
        <CardDescription>{monthName || 'Loading...'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 items-center">
          <div className="flex-1 space-y-2">
            <Label htmlFor="goal">My Goal</Label>
            <Input 
              id="goal" 
              type="number" 
              value={goal} 
              onChange={(e) => setGoal(Number(e.target.value))} 
              min="1"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label>Category</Label>
            <Select value={type} onValueChange={(value: EntryType) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="book">Books</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="music">Music</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Progress value={progress} className="w-full" />
          <p className="text-right text-sm text-muted-foreground mt-2">
            {currentCount} / {goal}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
