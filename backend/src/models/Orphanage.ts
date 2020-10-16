import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import Image from "./Image";
// One to Many serve para realizar o relacionamento entre tabelas
// Automaticamente o TypeORM entenderá que esta associada a tabela orphanages
@Entity("orphanages")
export default class Orphanage {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  about: string;

  @Column()
  instructions: string;

  @Column()
  opening_hours: string;

  @Column()
  open_on_weekends: boolean;

  // Primeiro parametro é o Image, e o segundo é para indicar qual o campo que retorna o orfanato
  // Terceiro parametro significa: Se cadastrar um orfanato e preencher ele com as imagens, quando for cadastrar ou alterar o orfanato, ele irá automaticamente cadastrar ou atualizar as imagens do orfanato
  @OneToMany(() => Image, (image) => image.orphanage, {
    cascade: ["insert", "update"],
  })
  @JoinColumn({ name: "orphanage_id" })
  images: Image[];
}
