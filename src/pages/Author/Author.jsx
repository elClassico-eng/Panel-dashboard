import { FlipLink } from "../../components/Author/FlipLink";
import { Title } from "../../components/Title/Title";

export const Author = () => {
    return (
        <div className="bg-blue-50 w-full h-full">
            <Title title="Author contacts" />
            <section className="grid place-content-center gap-2 px-8 py-24 text-black">
                <FlipLink href="#">Twitter</FlipLink>
                <FlipLink href="#">Linkedin</FlipLink>
                <FlipLink href="#">Facebook</FlipLink>
                <FlipLink href="#">Instagram</FlipLink>
            </section>
        </div>
    );
};
