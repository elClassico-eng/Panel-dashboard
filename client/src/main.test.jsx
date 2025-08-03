import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SortableCard } from "./components/Kanban/SortableCard";

const mockTask = {
    id: 1,
    title: "Добавить новые input в модели пользователя",
    description: "Описание задачи",
    deadline: "2025-06-01",
};

describe("SortableCard", () => {
    it("рендерит заголовок задачи", () => {
        render(<SortableCard task={mockTask} />);
        expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    });

    it("рендерит описание задачи", () => {
        render(<SortableCard task={mockTask} />);
        expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    });

    it("рендерит срок задачи", () => {
        render(<SortableCard task={mockTask} />);
        expect(screen.getByText(/2025-06-01/)).toBeInTheDocument();
    });

    it('показывает "Нет описания", если описание отсутствует', () => {
        const taskWithoutDescription = { ...mockTask, description: "" };
        render(<SortableCard task={taskWithoutDescription} />);
        expect(screen.getByText("Нет описания")).toBeInTheDocument();
    });

    it("вызывает функцию при клике на кнопку редактирования", () => {
        const onEdit = vi.fn();
        render(<SortableCard task={mockTask} onEdit={onEdit} />);
        const editButton = screen.getByRole("button", {
            name: /редактировать/i,
        });
        fireEvent.click(editButton);
        expect(onEdit).toHaveBeenCalledWith(mockTask.id);
    });
});
