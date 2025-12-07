import { useMutation, useQueryClient , useQuery} from "@tanstack/react-query";
import { BlogPost, getAllPosts, getPostById, getPostBySlug, postCommentInPost,
   CommentToSend, postLike, deleteLike } from "@/components/api/postAPI";

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
};

export const usePostQuery = (id: number) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostById(id),
    enabled: !!id, // tylko jeśli id istnieje
  });
};
export const usePostSlugQuery = (slug: string) => {
    return useQuery({
      queryKey: ["posts", slug],
      queryFn: () => getPostBySlug(slug),
      enabled: !!slug, // tylko jeśli id istnieje
    });
  };

export const usePostsAddCommentMutation = () => {
    const queryClient = useQueryClient();
    //const { toast } = useToast();
    return useMutation({
        // Funkcja do wykonania mutacji
        
        mutationFn: (comment: CommentToSend) => postCommentInPost(comment),
        
        
        onSuccess: (data, variables, context) => {
            const postId = variables.postId;
            console.log("Komentarz dodany",postId);
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            // toast({ // ⬅️ TOAST JEST TUTAJ
            //     title: "Welcome back! 🎉",
            //     description: "Successfully logged in.",
            // });
            //queryClient.setQueryData(['userProfile'], data);
        },
        
        onError: (error, variables, context) => {
            // Obsługa błędów logowania (np. złe hasło)
            console.error("Błąd dodawania komenatrza:", error);
            // Błąd zostanie obsłużony w komponencie
        },
    });
};


export const usePostLikeMutations = (slug: string, postId: number, userId: string | undefined) => {
    const queryClient = useQueryClient();

    // Klucz do zapytania, które chcemy ręcznie aktualizować (usePostSlugQuery)
    const postQueryKey = ["posts", slug];

    // Funkcja do optymistycznej aktualizacji stanu polubień
    const updatePostLikesInCache = (action: 'like' | 'unlike') => {
        // Używamy queryClient.setQueryData
        queryClient.setQueryData<BlogPost | undefined>(postQueryKey, (oldPostData) => {
            if (!oldPostData || !userId) return oldPostData;

            // Tworzenie nowej, tymczasowej listy polubień/lików
            let newLikes = [...oldPostData.likes]; 
            const likeExists = newLikes.some(l => l.userId === userId); 

            if (action === 'like' && !likeExists) {
                // 💡 LOGIKA DLA LIKE: Dodaj polubienie do listy (w Twoim przypadku, może to być tylko zwiększenie licznika)
                
                // Jeśli Twój obiekt Like ma więcej pól, musisz je dodać, np.:
                const newLikeItem = { userId: userId  };
                newLikes.push(newLikeItem as any); 
                
            } else if (action === 'unlike' && likeExists) {
                // 💡 LOGIKA DLA UNLIKE: Usuń polubienie z listy
                //console.log("unlike",likeExists)
                newLikes = newLikes.filter(l => l.userId !== userId);
            }

            // Zwracamy ZAKTUALIZOWANY obiekt posta
            return {
                ...oldPostData,
                likes: newLikes, // Nowa lista polubień
                // Ewentualnie:
                // likesCount: newLikes.length,
            };
        });
    };
    
    // --- MUTACJA DODAWANIA POLUBIENIA ---
    const addLikeMutation = useMutation({
        mutationFn: postLike,
        // Optymistyczna aktualizacja (opcjonalne, ale szybsze)
        onMutate: () => {
            updatePostLikesInCache('like');
        },
        // W przypadku błędu, rollback do starych danych
        onError: () => {
            updatePostLikesInCache('unlike'); // Cofnij akcję like (rollback)
            // Możesz też dodać queryClient.invalidateQueries(postQueryKey); w przypadku błędu.
        },
        // onSuccess: Wystarczy onMutate, ale jeśli chcesz potwierdzić:
        // onSuccess: () => updatePostLikesInCache('like'), 
    });

    // --- MUTACJA USUWANIA POLUBIENIA ---
    const removeLikeMutation = useMutation({
        mutationFn: deleteLike,
        onMutate: () => {
            updatePostLikesInCache('unlike');
        },
        onError: () => {
            updatePostLikesInCache('like'); // Cofnij akcję unlike (rollback)
        },
    });

    return { addLikeMutation, removeLikeMutation };
};
