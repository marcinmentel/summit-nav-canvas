import { useMutation, useQueryClient , useQuery} from "@tanstack/react-query";
import { authLogin, SignInCredentials,UserProfile , getCurrentUser} from "@/components/api/authAPI";
import { useToast } from "@/hooks/use-toast";

export const useAuthLoginMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        // Funkcja do wykonania mutacji
        
        mutationFn: (credentials: SignInCredentials) => authLogin(credentials),
        
        // Funkcje obsługi zdarzeń (Callbacks)
        
        onSuccess: (data, variables, context) => {
            // Logowanie się powiodło.
            console.log("Logowanie udane. Cookie ustawione.");
            toast({ // ⬅️ TOAST JEST TUTAJ
                title: "Welcome back! 🎉",
                description: "Successfully logged in.",
            });
            // Opcjonalnie: Unieważnij zapytania, które mogłyby się zmienić 
            // po zalogowaniu (np. 'userProfile', 'draftPosts').
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            
            // Przekieruj użytkownika
            window.location.href = '/';
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
// export const useCurrentUser = () => {
//     const { data, isLoading, isError, isSuccess } = useQuery<UserProfile | null>({
//         // Unikalny klucz zapytania
//         queryKey: ['currentUser'], 
        
//         // Funkcja, która pobiera dane użytkownika
//         queryFn: getCurrentUser(), 
        
//         // Ustawienia opcjonalne:
//         // Zapobiega ponownemu pobieraniu danych przy zmianie focusu na okno
//         staleTime: Infinity, 
//         // Włącza zapytanie tylko, jeśli ma sens (np. jest token)
//         // W przypadku logowania przez ciasteczka, możemy to zostawić na true
//         enabled: true, 
//     });

//     return {
//         user: data,
//         isLoading,
//         isLoggedIn: isSuccess && !!data, // Sprawdza, czy zapytanie się powiodło i dane nie są null
//         isError,
//     };
// };