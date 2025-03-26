import { supabase } from "./lib/supabaseClient";
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Card } from "./components/ui/Card";
import { CardContent } from "./components/ui/CardContent";
import { Input } from "./components/ui/Input";
import { Textarea } from "./components/ui/Textarea";
import { Button } from "./components/ui/Button";

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [testimonials, setTestimonials] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");

  const storedPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch testimonials:", error.message);
      } else {
        const filtered = data.filter((t) => t.rating >= 4); // Only show 4 and 5 stars
        setTestimonials(filtered);
      }
    };

    fetchTestimonials();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      console.error("Delete failed:", error.message);
    } else {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center px-4">
      <Card className="max-w-xl w-full border-2 border-black shadow-xl rounded-2xl p-6">
        <CardContent>
          <h1 className="text-3xl font-bold text-center text-pink-600 mb-4">
            Lash Fluent Brow 💖
          </h1>
          {submitted ? (
            <div className="text-center text-green-600">
              Thank you for your feedback!
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const name = e.target[0].value;

                const { error } = await supabase.from("testimonials").insert([
                  {
                    name: name || "Anonymous",
                    rating,
                    comment,
                  },
                ]);

                if (error) {
                  console.error("Error inserting testimonial:", error.message);
                  alert("There was an issue submitting your feedback.");
                } else {
                  setSubmitted(true);
                  setTimeout(() => setSubmitted(false), 3000);
                  setComment("");
                  setRating(0);
                  setHover(0);
                }
              }}
              className="space-y-4"
            >
              <Input placeholder="Your name (optional)" className="w-full border px-3 py-2 rounded-md" />
              <div>
                <label className="text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Heart
                      key={star}
                      className={`h-6 w-6 cursor-pointer transition-colors ${
                        (hover || rating) >= star
                          ? "fill-pink-500 text-pink-500"
                          : "text-gray-300"
                      }`}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Additional comments"
                rows="4"
                className="w-full border px-3 py-2 rounded-md"
              />
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded"
              >
                Submit Feedback
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="mt-10 w-full max-w-xl">
        <h3 className="text-xl font-semibold text-center text-pink-600 mb-4">
          Client Testimonials 💕
        </h3>

        <div className="space-y-4 overflow-x-auto whitespace-nowrap flex gap-4">
          {testimonials.map((t) => (
            <Card key={t.id} className="bg-white min-w-[250px] border-pink-200 border shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-black">{t.name || "Anonymous"}</span>
                <span className="text-pink-500">
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </span>
              </div>
              <p className="text-sm text-gray-700 italic">"{t.comment}"</p>
              {isAdmin && (
                <Button
                  onClick={() => handleDelete(t.id)}
                  className="mt-2 text-xs bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 w-full max-w-xl">
        <Card className="border-2 border-black shadow-xl rounded-2xl p-6">
          <CardContent>
            <h3 className="text-xl font-semibold text-center text-pink-600 mb-4">
              Follow Us on Instagram 📷
            </h3>
            <div className="flex justify-center">
              <iframe
                src="https://snapwidget.com/embed/1091548"
                className="snapwidget-widget"
                allowtransparency="true"
                frameBorder="0"
                scrolling="no"
                style={{ border: "none", overflow: "hidden", width: "100%", height: "500px" }}
                title="Posts from Instagram"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isAdmin && (
        <div className="mt-8 max-w-xs w-full">
          <Input
            type="password"
            placeholder="Admin Password"
            value={adminPasswordInput}
            onChange={(e) => setAdminPasswordInput(e.target.value)}
            className="mb-2"
          />
          <Button
            onClick={() => {
              if (adminPasswordInput === storedPassword) {
                setIsAdmin(true);
              } else {
                alert("Incorrect password");
              }
            }}
            className="w-full bg-black text-white"
          >
            Enter Admin Mode
          </Button>
        </div>
      )}

      {isAdmin && (
        <div className="mt-4 max-w-xs w-full">
          <Button
            onClick={() => {
              setIsAdmin(false);
              setAdminPasswordInput("");
            }}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white"
          >
            Exit Admin Mode
          </Button>
        </div>
      )}
    </div>
  );
}
