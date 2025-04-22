import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, DotProps, Area } from "recharts";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import clsx from "clsx";

// Sample data
const data = [
  { value: 12 },
  { value: 25 },
  { value: 14 },
  { value: 1 },
  { value: 16 },
  { value: 0 },
  { value: 23 }
];

// CustomDot with `index` manually added to the type
interface CustomDotProps extends DotProps {
  index?: number;
}

const CustomDot = ({ cx, cy, index }: CustomDotProps) => {
  if (index === 5 && cx !== undefined && cy !== undefined) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="black"
        stroke="black"
        strokeWidth={1}
      />
    );
  }
  return null;
};
interface TopcardProp {
  title: string;
  subText: string;
  direction: "surged" | "decreased";
  percent: number;
  amount: number;
}
const TopCard = ({ title, amount, subText, direction }: TopcardProp) => {
  return (
    <Card className="w-full max-w-md rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-muted-foreground mb-1">
              {title}
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">${amount} </div>
              <div
                className={clsx(
                  "flex items-center   px-2 py-0.5 rounded-md text-xs font-semibold",
                  direction === "decreased"
                    ? "text-red-600 bg-red-100"
                    : "text-green-600 bg-green-100"
                )}
              >
                {direction === "decreased" ? (
                  <TrendingDown className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingUp className="w-3 h-3 mr-1" />
                )}
                +0.6%
              </div>
            </div>

            <div className="text-sm flex items-center space-x-2 mt-1">
              <span className="text-muted-foreground">
                Yeay! your {subText} have {direction} by $723.12 from last
                month!
              </span>
            </div>
          </div>
          <div className="p-1 rounded-full border">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-[100px]">
        <ResponsiveContainer className="" width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#000"
              strokeWidth={2}
              dot={<CustomDot />}
              isAnimationActive={true}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="rgba(0,0,0,0.05)" // light gray
              fillOpacity={1}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopCard;
