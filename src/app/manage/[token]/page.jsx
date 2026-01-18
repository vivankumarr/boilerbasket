import { supabaseService } from "@/lib/supabase/service";
import ManageUI from "../ManageUI";
import Navbar from "@/app/book/Navbar"; // Adjust path to your Navbar
import { calculateEffectiveSlots } from "@/app/book/page";

export default async function ManagePage({ params }) {
  const { token } = await params;
  const supabase = supabaseService;;

  // Fetch appointment based on edit token
  const { data: appointment, error } = await supabase
    .from('appointments')
    .select('*, clients(*)')
    .eq('edit_token', token)
    .single();

  // 2. Security / Error Handling
  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-purple-100 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Appointment Not Found</h1>
          <p className="text-gray-600 mt-2">This link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const availableSlots = await calculateEffectiveSlots();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-purple-100 to-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Hi, {appointment.clients?.full_name?.split(' ')[0] || 'Guest'}
          </h1>
        </div>
        
        {/* Client UI component */}
        <ManageUI
          appointment={appointment} 
          availableSlots={availableSlots} 
        />
      </div>
    </div>
  );
}