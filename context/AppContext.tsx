import React, { createContext, useContext, useState, useCallback } from "react";
import { Post, ProfileSection, UserProfile } from "@/types";
import { currentUser, initialPosts } from "@/constants/mockData";

interface AppContextValue {
  profile: UserProfile;
  posts: Post[];
  updateBio: (bio: string) => void;
  updateAvatar: (uri: string) => void;
  addSection: (section: Omit<ProfileSection, "order">) => { ok: boolean; error?: string };
  updateSection: (id: string, updates: Partial<ProfileSection>) => void;
  deleteSection: (id: string) => void;
  addPost: (post: Omit<Post, "id" | "authorId" | "createdAt" | "likes" | "liked" | "comments" | "archived">) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  movePostToSection: (postId: string, sectionId: string | null) => void;
  deletePost: (id: string) => void;
  archivePost: (id: string, archived: boolean) => void;
  toggleLike: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const MAX_SECTIONS = 10;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(currentUser);
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const updateBio = useCallback((bio: string) => {
    setProfile((p) => ({ ...p, bio: bio.slice(0, 300) }));
  }, []);

  const updateAvatar = useCallback((uri: string) => {
    setProfile((p) => ({ ...p, avatarUri: uri }));
  }, []);

  const addSection = useCallback(
    (section: Omit<ProfileSection, "order">) => {
      let result: { ok: boolean; error?: string } = { ok: true };
      setProfile((p) => {
        if (p.sections.length >= MAX_SECTIONS) {
          result = { ok: false, error: `Puoi creare al massimo ${MAX_SECTIONS} sezioni.` };
          return p;
        }
        const newSection: ProfileSection = { ...section, order: p.sections.length };
        return { ...p, sections: [...p.sections, newSection] };
      });
      return result;
    },
    []
  );

  const updateSection = useCallback((id: string, updates: Partial<ProfileSection>) => {
    setProfile((p) => ({
      ...p,
      sections: p.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const deleteSection = useCallback((id: string) => {
    setProfile((p) => ({ ...p, sections: p.sections.filter((s) => s.id !== id) }));
    setPosts((prev) => prev.map((post) => (post.sectionId === id ? { ...post, sectionId: null } : post)));
  }, []);

  const addPost = useCallback(
    (post: Omit<Post, "id" | "authorId" | "createdAt" | "likes" | "liked" | "comments" | "archived">) => {
      const newPost: Post = {
        ...post,
        id: `p${Date.now()}`,
        authorId: "me",
        createdAt: Date.now(),
        likes: 0,
        liked: false,
        comments: 0,
        archived: false,
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    []
  );

  const updatePost = useCallback((id: string, updates: Partial<Post>) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...updates } : post)));
  }, []);

  const movePostToSection = useCallback((postId: string, sectionId: string | null) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, sectionId } : post)));
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  }, []);

  const archivePost = useCallback((id: string, archived: boolean) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, archived } : post)));
  }, []);

  const toggleLike = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
      )
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        posts,
        updateBio,
        updateAvatar,
        addSection,
        updateSection,
        deleteSection,
        addPost,
        updatePost,
        movePostToSection,
        deletePost,
        archivePost,
        toggleLike,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve essere usato dentro AppProvider");
  return ctx;
}
