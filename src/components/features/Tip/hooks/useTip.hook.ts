import { tips } from "@/services/mocks/tips.mock";

export const useTip = (props: { id: number }) => {
    const { id } = props;

    return {
        tip: tips[id - 1],
    };
};
