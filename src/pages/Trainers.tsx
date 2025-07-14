import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import { useState } from "react";

const mockTrainers = [
  {
    id: '1',
    name: 'Lucas Personal',
    email: 'lucas@personal.com',
    bio: 'Especialista em hipertrofia e emagrecimento.',
    experience: '5 anos',
    avatar_url: null,
  },
  {
    id: '2',
    name: 'Fernanda Fit',
    email: 'fernanda@fit.com',
    bio: 'Personal focada em treinos funcionais e motivação.',
    experience: '3 anos',
    avatar_url: null,
  },
];

const Trainers = () => {
  const [search, setSearch] = useState("");
  const filtered = mockTrainers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.bio.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-fitness-primary/20 to-fitness-secondary/20"></div>
        <div className="container relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-fitness-primary to-fitness-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Personal Trainers</h1>
            <p className="text-xl text-muted-foreground">Encontre profissionais qualificados para te ajudar a alcançar seus objetivos</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-2xl mx-auto mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome ou especialidade..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <Card className="text-center py-16 max-w-2xl mx-auto bg-background/80 backdrop-blur border-primary/20">
                <CardContent>
                  <div className="w-20 h-20 bg-gradient-to-br from-fitness-primary/20 to-fitness-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Nenhum personal trainer encontrado</h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Tente ajustar sua busca ou volte mais tarde.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filtered.map(trainer => (
                <Card key={trainer.id} className="group hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur border-primary/20 hover:border-primary/40 overflow-hidden">
                  <CardHeader className="relative pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-fitness-primary to-fitness-secondary flex items-center justify-center text-white font-bold text-2xl">
                        {trainer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{trainer.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          {trainer.email}
                        </CardDescription>
                        <div className="text-sm text-muted-foreground mt-1">{trainer.bio}</div>
                        <div className="text-xs text-muted-foreground">Experiência: {trainer.experience}</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers; 