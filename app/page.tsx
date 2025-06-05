"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, BookOpen, Award, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { ScrollProgress } from "@/components/scroll-progress";
import { useEffect, useState } from "react";
import { Course, Chapter } from "@prisma/client";

type CourseWithChapters = Course & {
  chapters?: Chapter[];
};

export default function HomePage() {
  const [courses, setCourses] = useState<CourseWithChapters[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollIndicator(entry.isIntersecting);
      },
      {
        threshold: 0.5, // Trigger when 50% of the hero section is visible
      }
    );

    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, []);

  const scrollToCourses = () => {
    const coursesSection = document.getElementById('courses-section');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full w-full bg-background">
      <Navbar />
      <ScrollProgress />
      {/* Hero Section */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              نادر غزال
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              منصة تعليمية متكاملة لتبسيط المواد الدراسية
            </p>
            <Button size="lg" asChild className="bg-[#BC8B26] hover:bg-[#BC8B26]/90 text-white">
              <Link href="/sign-up">
                ابدأ الآن <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] w-full"
          >
            <Image
              src="/teacher-image.png"
              alt="نادر غزال"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={scrollToCourses}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <ChevronDown className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            >
              <ChevronDown className="h-8 w-8 text-muted-foreground" />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Courses Section */}
      <section id="courses-section" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الدورات التعليمية</h2>
            <p className="text-muted-foreground">اكتشف مجموعة متنوعة من الدورات التعليمية المميزة</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg p-6 shadow-lg animate-pulse"
                >
                  <div className="h-48 bg-muted rounded-md mb-4"></div>
                  <div className="h-6 bg-muted rounded-md mb-2"></div>
                  <div className="h-4 bg-muted rounded-md mb-4"></div>
                  <div className="h-10 bg-muted rounded-md"></div>
                </div>
              ))
            ) : courses.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground">
                لا توجد دورات متاحة حالياً
              </div>
            ) : (
              courses.map((course, index) => {
                const chapters = course.chapters ?? [];
                const hasChapters = chapters.length > 0;
                const firstChapter = hasChapters ? chapters[0] : null;

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48 bg-muted rounded-md mb-4 overflow-hidden">
                      {course.imageUrl ? (
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          لا توجد صورة
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {course.description || "لا يوجد وصف للدورة"}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      asChild
                      disabled={!hasChapters}
                    >
                      <Link 
                        href={hasChapters && firstChapter
                          ? `/courses/${course.id}/chapters/${firstChapter.id}`
                          : `/courses/${course.id}`
                        }
                      >
                        {hasChapters ? "ابدأ التعلم" : "عرض التفاصيل"}
                      </Link>
                    </Button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">آراء الطلاب</h2>
            <p className="text-muted-foreground">ماذا يقول طلابنا عن تجربتهم معنا</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "عصام اسامة",
                grade: "الصف الأول الثانوي",
                testimonial: "تجربة رائعة مع الأستاذ نادر، شرح مميز وطريقة سهلة في توصيل المعلومة"
              },
              {
                name: "سيف طارق",
                grade: "الصف الثاني الثانوي",
                testimonial: "المنهج منظم جداً والشرح واضح، ساعدني في فهم المواد بشكل أفضل"
              },
              {
                name: "عمر جمال",
                grade: "الصف الأول الثانوي",
                testimonial: "أفضل منصة تعليمية استخدمتها، المحتوى غني والشرح مبسط"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src="/male.png"
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mr-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.grade}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "{testimonial.testimonial}"
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الخبرة والرؤية</h2>
            <p className="text-muted-foreground">تعرف على خبراتنا وفلسفتنا التعليمية</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">خبرة واسعة</h3>
              <p className="text-muted-foreground">
                سنوات من الخبرة في تدريس المواد الدراسية
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">منهج متكامل</h3>
              <p className="text-muted-foreground">
                شرح مبسط ومنهجية سهلة في توصيل المعلومة
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">نتائج متميزة</h3>
              <p className="text-muted-foreground">
                نجاحات وإنجازات طلابنا خير دليل
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ابدأ رحلة التعلم معنا</h2>
            <p className="text-muted-foreground mb-8">
              انضم إلينا اليوم وابدأ رحلة النجاح
            </p>
            <Button size="lg" asChild>
              <Link href="/sign-up">
                سجل الآن <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 