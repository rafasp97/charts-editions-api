import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where
} from "firebase/firestore";
import { db } from './database/firebase';
import type { Artist } from "./interfaces/Artist.interface";
import { FireBaseData } from './interfaces/FireBaseData.inferface';

@Injectable()
export class FireBaseService {
  async getLastRankByGroup(groupName: string): Promise<FireBaseData> {
    const groupId = await this.getGroupId(groupName);
    const colRef = collection(db, "ranks");

    const q = query(
      colRef,
      where("groupId", "==", groupId),
      orderBy("createdAt", "desc"),
      limit(2)
    );

    const snapshot = await getDocs(q);
    const doc0 = snapshot.docs.at(0);
    const doc1 = snapshot.docs.at(1);

    if (!doc0) {
      throw new NotFoundException('Registro não encontrado.');
    }

    const lastRank = doc0.data();
    const penultRank = doc1?.data();

    const now = new Date();
    const lastRankDate = lastRank.createdAt.toDate();
    const isCreatedToday = now.toDateString() === lastRankDate.toDateString();

    return {
      createdAt: !isCreatedToday ? lastRankDate : penultRank?.createdAt.toDate(),
      data: !isCreatedToday ? JSON.parse(lastRank.rank) as Artist[] : JSON.parse(penultRank?.rank) as Artist[],
      lastDate: lastRankDate
    };
  }

  async getGroupId(groupName: string): Promise<string | null> {
    try {
      const colRef = collection(db, "groups");
      const q = query(
        colRef,
        where("name", "==", groupName)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty || !snapshot.docs[0]) {
        console.warn("Nenhum grupo encontrado");
        return null;
      }
      return snapshot.docs[0].id;
    } catch (error) {
      console.error("Erro ao buscar IDs de grupos:", error);
      return null;
    }
  }

  async registerNewRank(rank: Artist[], groupName: string) {
    const groupId = await this.getGroupId(groupName);
    try {
      await addDoc(collection(db, "ranks"), {
        groupId,
        rank: rank,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      throw new InternalServerErrorException("Erro ao registrar novo rank");
    }
  }


}
