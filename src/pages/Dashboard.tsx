
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Calendar, Clock, Flame, TrendingUp, Dumbbell, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Dados simulados para demonstração (quando houver dados reais, será substituído)
  const workoutData = [
    { date: "01/01", duration: 60, calories: 300, type: "Hipertrofia" },
    { date: "02/01", duration: 30, calories: 250, type: "Cardio" },
    { date: "03/01", duration: 75, calories: 400, type: "Hipertrofia" },
    { date: "04/01", duration: 45, calories: 350, type: "Cardio" },
    { date: "05/01", duration: 65, calories: 320, type: "Hipertrofia" },
    { date: "06/01", duration: 50, calories: 150, type: "Flexibilidade" },
    { date: "07/01", duration: 55, calories: 280, type: "Hipertrofia" },
  ];

  const workoutTypes = [
    { name: "Hipertrofia", value: 4, color: "#8b5cf6" },
    { name: "Cardio", value: 2, color: "#06b6d4" },
    { name: "Flexibilidade", value: 1, color: "#10b981" },
  ];

  const chartConfig = {
    duration: {
      label: "Duração (min)",
      color: "#8b5cf6",
    },
    calories: {
      label: "Calorias",
      color: "#06b6d4",
    },
  };

  const totalWorkouts = workoutData.length;
  const totalDuration = workoutData.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCalories = workoutData.reduce((sum, workout) => sum + workout.calories, 0);
  const avgDuration = Math.round(totalDuration / totalWorkouts);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Faça login para ver seu dashboard</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">Dashboard de Treinos</h1>
        <p className="text-muted-foreground">Acompanhe seu progresso e estatísticas</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDuration}min</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calorias Queimadas</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories}</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration}min</div>
            <p className="text-xs text-muted-foreground">Por treino</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Duração dos Treinos */}
        <Card>
          <CardHeader>
            <CardTitle>Duração dos Treinos</CardTitle>
            <CardDescription>Tempo gasto em cada sessão de treino</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={workoutData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="duration" fill="var(--color-duration)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Calorias */}
        <Card>
          <CardHeader>
            <CardTitle>Calorias Queimadas</CardTitle>
            <CardDescription>Evolução das calorias queimadas por treino</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart data={workoutData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="var(--color-calories)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-calories)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Pizza - Tipos de Treino */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição dos Tipos de Treino</CardTitle>
          <CardDescription>Proporção dos diferentes tipos de treino realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={workoutTypes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {workoutTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Lista de Treinos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Treinos Recentes</CardTitle>
          <CardDescription>Seus últimos treinos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workoutData.slice(-5).reverse().map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-fitness-primary"></div>
                  <div>
                    <p className="font-medium">{workout.type}</p>
                    <p className="text-sm text-muted-foreground">{workout.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{workout.duration} min</p>
                  <p className="text-sm text-muted-foreground">{workout.calories} cal</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
