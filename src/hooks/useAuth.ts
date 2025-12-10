import { useMutation, useQueryClient , useQuery} from "@tanstack/react-query";
import { authLogin, SignInCredentials,authLogout , getCurrentUser ,authRegister , SignUpCredentials , UserProfile, authLoginWithGoogle} from "@/components/api/authAPI";
import { useToast } from "@/hooks/use-toast";

export const useAuthLoginMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        // Funkcja do wykonania mutacji
        
        mutationFn: (credentials: SignInCredentials) => authLogin(credentials),
        
        // Funkcje obsługi zdarzeń (Callbacks)
        
        onSuccess: (data: UserProfile, variables, context) => {
            // Logowanie się powiodło.
            console.log("Logowanie udane. Cookie ustawione.");
            toast({ // ⬅️ TOAST JEST TUTAJ
                title: "Welcome back! 🎉",
                description: "Successfully logged in.",
            });

            queryClient.setQueryData(['userProfile'], data);
            //queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            
            console.log("userProf: ", data);
            // Przekieruj użytkownika
        },
        
        onError: (error, variables, context) => {
            // Obsługa błędów logowania (np. złe hasło)
            console.error("Błąd logowania:", error);
            // Błąd zostanie obsłużony w komponencie
        },
    });
};
export const useCurrentUser = () => {
    return useQuery ({
        // Unikalny klucz zapytania
        queryKey: ['currentUser'], 
        queryFn: () => getCurrentUser() , 
        staleTime: Infinity, 
        enabled: true
    });
}

export const useAuthLogoutMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    
    return useMutation({
        mutationFn: authLogout,
        
        onSuccess: () => {
            
            queryClient.removeQueries({ queryKey: ['userProfile'] }); 
            
            //queryClient.clear(); 
            toast({
                title: "Wylogowano! 👋",
                description: "Zostałeś bezpiecznie wylogowany.",
            });
            
        },
        
        onError: (error) => {
            console.error("Błąd wylogowania:", error);
            toast({
                variant: "destructive",
                title: "Błąd wylogowania",
                description: "Wystąpił problem z serwerem. Spróbuj ponownie.",
            });
        },
    });
};

export const useAuthRegisterMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        // Funkcja do wykonania mutacji
        
        mutationFn: (credentials: SignUpCredentials) => authRegister(credentials),
        
        
        onSuccess: (data, variables, context) => {
            // Logowanie się powiodło.
            console.log("Logowanie udane. Cookie ustawione.");
            toast({ // ⬅️ TOAST JEST TUTAJ
                title: "Welcome back! 🎉",
                description: "Successfully logged in.",
            });
            queryClient.setQueryData(['userProfile'], data);
        },
        
        onError: (error, variables, context) => {
            // Obsługa błędów logowania (np. złe hasło)
            console.error("Błąd rejestracji:", error);
            // Błąd zostanie obsłużony w komponencie
        },
    });
};

export const useAuthUser = () => {
    const queryClient = useQueryClient();
    
    // Używamy useQuery, ale tylko do odczytu z pamięci podręcznej, bez wywoływania API
    return useQuery<UserProfile>({
        queryKey: ['userProfile'], 
        // ❌ queryFn jest pusty lub pominięty, nie chcemy dzwonić na serwer
        staleTime: 5 * 60 * 1000, // Dane są świeże przez 5 minut
        refetchOnWindowFocus: false, // Nie odświeżaj przy przełączaniu okien
        queryFn: async () => {
            try {
                // Ta funkcja zadziała tylko, jeśli ciasteczko/token jest ważne.
                // Jeśli nie jest, Axios zwróci błąd 401, który zostanie złapany.
                return await getCurrentUser(); 
            } catch (error) {
                // Błąd 401 oznacza, że użytkownik nie jest zalogowany (lub sesja wygasła)
                // W tej sytuacji zwracamy null, aby poprawnie obsłużyć stan wylogowania
                return null; 
            }
        },
    });
};

export const useAuthLoginWithGoogle = () => {

    return useMutation ({
        mutationFn: authLoginWithGoogle,
        onSuccess: () => {
            console.log("useAuthGoogleOK");
        },
        onError: (error ) => {
            console.log("useAuthGoogle",error);

        },
    });
};