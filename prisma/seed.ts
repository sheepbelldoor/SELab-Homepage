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
      labName: "SE Lab",
      tagline: "Software Engineering Laboratory",
      description:
        "소프트웨어 공학의 핵심 문제를 해결하고, 더 나은 소프트웨어 개발 방법론을 연구합니다.",
      address: "서울특별시 OO구 OO로 OO",
      building: "공학관 000호",
      email: "selab@university.ac.kr",
      phone: "02-000-0000",
      aboutContent:
        "SE Lab은 소프트웨어 공학 분야의 다양한 연구를 수행하는 연구실입니다. 소프트웨어 개발 프로세스, 품질 보증, 테스팅, 유지보수 등의 주제를 중심으로 실용적이고 혁신적인 연구를 진행하고 있습니다.",
      joinUsContent:
        "SE Lab에서는 열정적인 대학원생 및 인턴을 모집하고 있습니다. 소프트웨어 공학에 관심이 있는 분은 언제든지 연락해 주세요.",
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

  await prisma.member.create({
    data: {
      name: "홍길동",
      nameEn: "Gildong Hong",
      role: "professor",
      interest: "Software Testing, Program Analysis",
      email: "gdhong@university.ac.kr",
      sortOrder: 0,
    },
  });

  console.log("Seed data created successfully");
  console.log(`Admin credentials: admin / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
