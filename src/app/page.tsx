"use client";

import ScrollStoryContainer from "@/components/scroll-story/ScrollStoryContainer";
import StoryIntroduction from "@/components/scroll-story/StoryIntroduction";
import Era01Pixel from "@/components/scroll-story/eras/Era01Pixel";
import Era02Bit from "@/components/scroll-story/eras/Era02SixteenBit";
import Era03Polygons from "@/components/scroll-story/eras/Era03Polygons";
import Era04Cloud from "@/components/scroll-story/eras/Era04Cloud";

export default function Home() {
  return (
    <main>
      <StoryIntroduction />

      <ScrollStoryContainer>
        {(scrollYProgress) => (
          <>
            <Era01Pixel scrollYProgress={scrollYProgress} />
            <Era02Bit scrollYProgress={scrollYProgress} />
            <Era03Polygons scrollYProgress={scrollYProgress} />
            <Era04Cloud scrollYProgress={scrollYProgress} />
          </>
        )}
      </ScrollStoryContainer>
    </main>
  );
}