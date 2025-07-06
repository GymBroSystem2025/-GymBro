import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProfileCreate from "./ProfileCreate";

const ProfileEdit = () => {
  const [initialData, setInitialData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return navigate("/auth");
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!error && data) {
        setInitialData(data);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Reutiliza o formulário de criação, mas passa os dados iniciais para edição
  return <ProfileCreate initialData={initialData} isEditMode />;
};

export default ProfileEdit; 