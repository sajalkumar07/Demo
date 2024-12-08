import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, LoaderCircle } from "lucide-react";

// Sample blog post data (unchanged from previous implementation)
const BLOG_POSTS = [
  {
    id: 1,
    title: "Introduction to React Hooks",
    excerpt:
      "Discover the power of React Hooks and how they revolutionize state management...",
    tags: ["react", "javascript", "programming"],
    author: "Jane Doe",
  },
  {
    id: 2,
    title: "Tailwind CSS Best Practices",
    excerpt:
      "Learn how to create efficient and responsive designs with Tailwind CSS...",
    tags: ["css", "design", "tailwind"],
    author: "John Smith",
  },
  {
    id: 3,
    title: "Advanced JavaScript Techniques",
    excerpt:
      "Explore advanced JavaScript methods and functional programming concepts...",
    tags: ["javascript", "programming"],
    author: "Alice Johnson",
  },
  {
    id: 4,
    title: "Web Performance Optimization",
    excerpt:
      "Strategies to improve your web application's speed and efficiency...",
    tags: ["performance", "web", "optimization"],
    author: "Bob Williams",
  },
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(2);
  const observerRef = useRef(null);
  const lastPostRef = useRef(null);

  // Unique tags from blog posts
  const availableTags = useMemo(
    () => [...new Set(BLOG_POSTS.flatMap((post) => post.tags))],
    []
  );

  // Filter logic
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => post.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchTerm, selectedTags]);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Infinite scroll implementation
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisiblePosts((prev) => Math.min(prev + 2, filteredPosts.length));
        }
      },
      { threshold: 0.5 }
    );

    if (lastPostRef.current) {
      observerRef.current = observer;
      observer.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, filteredPosts]);

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[300px]">
      <LoaderCircle className="animate-spin text-blue-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Search and Filter Container */}
          <div className="flex justify-center relative mb-10 animate-fade-in">
            <input
              type="text"
              placeholder="Search blogs, authors, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Tag Filters */}
          <div className="mb-6 flex flex-wrap gap-2 items-center animate-slide-in-down">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition duration-300 ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow animate-pulse">
                <p className="text-gray-500">No results found</p>
              </div>
            ) : (
              filteredPosts.slice(0, visiblePosts).map((post, index) => (
                <div
                  key={post.id}
                  ref={index === visiblePosts - 1 ? lastPostRef : null}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 group animate-fade-in-up"
                >
                  <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      By {post.author}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
