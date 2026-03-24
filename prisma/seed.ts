import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password: hashedPassword },
  });

  await prisma.siteConfig.upsert({
    where: { id: "main" },
    update: {},
    create: {
      labName: "Software Engineering Laboratory",
      tagline: "떼잉..",
      description:
        "소프트웨어 공학의 핵심 문제를 해결하고, 더 나은 소프트웨어 개발 방법론을 연구합니다.",
      address: "서울특별시 성동구 왕십리로 222",
      building: "한양대학교 ITBT 614호",
      email: "yunhokim@hanyang.ac.kr",
      phone: "02-2220-2385",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d559.1386440000607!2d127.0490294341321!3d37.55586919885408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca59a112efe17%3A0x6c8e2441f4b2ff7e!2z7ZWc7JaR64yA7ZWZ6rWQIElUQlTqtIA!5e0!3m2!1sko!2skr!4v1774328127956!5m2!1sko!2skr",
      aboutContent:
        "SELab은 소프트웨어 공학 분야의 다양한 연구를 수행하는 연구실입니다. 소프트웨어 개발 프로세스, 품질 보증, 테스팅, 유지보수 등의 주제를 중심으로 실용적이고 혁신적인 연구를 진행하고 있습니다.",
      joinUsContent:
        "SELab에서는 열정적인 대학원생 및 인턴을 모집하고 있습니다. 소프트웨어 공학에 관심이 있는 분은 언제든지 연락해 주세요.",
    },
  });

  const researchAreas = [
    {
      title: "Software Testing",
      description:
        "자동화된 테스트 생성, 회귀 테스트, 뮤테이션 테스팅 등 소프트웨어 품질을 보장하기 위한 다양한 테스팅 기법을 연구합니다.",
      sortOrder: 1,
    },
    {
      title: "Software Maintenance",
      description:
        "코드 리팩토링, 기술 부채 관리, 소프트웨어 진화 등 소프트웨어의 장기적인 유지보수성을 향상시키는 방법을 연구합니다.",
      sortOrder: 2,
    },
    {
      title: "AI for Software Engineering",
      description:
        "인공지능과 머신러닝 기술을 소프트웨어 공학에 적용하여 개발 생산성과 코드 품질을 높이는 연구를 수행합니다.",
      sortOrder: 3,
    },
  ];

  for (const area of researchAreas) {
    await prisma.research.create({ data: area });
  }

  const members = [
    {
      name: "김윤호",
      nameEn: "Yunho Kim",
      role: "professor",
      bio: "한양대학교 컴퓨터소프트웨어학부 조교수",
      interest: "",
      email: "yunhokim@hanyang.ac.kr",
      homepage: "https://yunho-kim.github.io/",
      scholar: "https://scholar.google.com/citations?user=kkT03G0AAAAJ&hl=ko&oi=ao",
      sortOrder: 0,
    },
    {
      name: "모현민",
      nameEn: "Hyeonmin Mo",
      role: "msphd",
      interest: "",
      email: "hyeonminmo@hanyang.ac.kr",
      github: "https://github.com/hyeonminmo",
      scholar: "https://scholar.google.com/citations?user=9s7ppLEAAAAJ&hl=ko&oi=sra",
      sortOrder: 1,
    },
    {
      name: "정지나",
      nameEn: "Gina Jung",
      role: "msphd",
      interest: "",
      email: "snowgina@hanyang.ac.kr",
      github: "https://github.com/jung-gina",
      scholar: "",
      sortOrder: 2,
    },
    {
      name: "양종문",
      nameEn: "Jongmun Yang",
      role: "msphd",
      interest: "",
      email: "jongmunyang@hanyang.ac.kr",
      github: "https://github.com/sheepbelldoor",
      scholar: "https://scholar.google.com/citations?user=UEOC_j4AAAAJ&hl=ko&oi=ao",
      sortOrder: 3,
    },
  ];

  for (const m of members) {
    await prisma.member.create({ data: m });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
