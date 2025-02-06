"use server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ExtendedUser } from "../_components/profileTab";
import { db } from "@/app/_lib/prisma";
import { redirect } from "next/navigation";

export const saveImage = async (
  loggedUser: { loggedUser: ExtendedUser },
  file: File,
) => {
  const client = new S3Client();

  const buffer = (await file.arrayBuffer()) as unknown as Buffer;

  const key = `profile_pic/${loggedUser.loggedUser.id}.${file.type.split("/")[1]}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    ACL: "public-read",
    Key: key,
    Body: buffer,
  });

  await client.send(command);

  await db.user.update({
    where: { id: loggedUser.loggedUser.id },
    data: {
      image: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
    },
  });

  redirect("/adm/settings");
};
